import os
import time
from botocore.serialize import Serializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from django.conf import settings
from .models import FloorPlan, InteriorDesign, DesignStyle, DesignPreference
from .serializers import (
    FloorPlanSerializer, InteriorDesignSerializer, DesignStyleSerializer,
    DesignPreferenceSerializer, DesignGenerationRequestSerializer, RoomDesignRequestSerializer
)
from .utils import generate_interior_design, upload_to_supabase
from rest_framework.views import APIView
from .serializers import Generate3DLayoutRequestSerializer
import replicate
from rest_framework.parsers import MultiPartParser, FormParser
import boto3
import os
from datetime import datetime
import uuid
import logging

logger = logging.getLogger(__name__)


AWS_BUCKET_NAME = "interior-pilot"
AWS_REGION = "ap-south-1"

s3_client = boto3.client(
    "s3",
    aws_access_key_id="AKIA34AMDGM5RKE45URB",
    aws_secret_access_key="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",
    region_name=AWS_REGION,
)

class UploadImageView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    def post(self, request):
        try:
            if 'image' not in request.FILES:
                return Response(
                    {'error': 'No image file provided'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            image_file = request.FILES['image']
            # Generate a unique filename to avoid conflicts
            #file_extension = os.path.splitext(image_file.name)[1]
            #unique_filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}{file_extension}"
            image_key = f"{image_file.name}"

            try:
                s3_client.upload_fileobj(
                    image_file,
                    AWS_BUCKET_NAME,
                    image_key,
                    
                )
                
                file_url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{image_key}"
                return Response({
                    'url': file_url,
                    'message': 'Image uploaded successfully'
                }, status=status.HTTP_200_OK)
                
            except Exception as e:
                logger.error(f"Error uploading to S3: {str(e)}")
                return Response(
                    {'error': 'Failed to upload image'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class RoomDesignView(APIView):
    def post(self, request):
        try:
            serializer = RoomDesignRequestSerializer(data=request.data)
            if serializer.is_valid():
                # Configure Replicate client with API token
                replicate.Client(api_token=os.getenv('REPLICATE_API_TOKEN'))
                
                # Format the prompt
                prompt = f"""Generate a high quality resolution image of a {serializer.validated_data['theme']}-themed {serializer.validated_data['room_type']} with a {serializer.validated_data['color']} 
                        color design with {serializer.validated_data['accessories']}. With these furniture {serializer.validated_data['furniture']}. Soft rugs, {serializer.validated_data['walls']} walls, and 
                        {serializer.validated_data['lights']} create warmth, making it {serializer.validated_data['realistic']}."""
                
                input_data = {
                    "image": serializer.validated_data['image'],
                    "prompt": prompt,
                }
                
                # Run the model
                output = replicate.run(
                    "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
                    input=input_data
                )
                
                # Generate unique filename
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                unique_id = uuid.uuid4().hex[:8]
                filename = f"roomdesign_{timestamp}_{unique_id}.png"
                file_path = os.path.join('roomdesign', filename)
                
                # Upload to S3
                try:
                    s3_client.put_object(
                        Bucket=AWS_BUCKET_NAME,
                        Key=file_path,
                        Body=output.read(),
                        ContentType='image/png'
                    )
                    
                    file_url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{file_path}"
                    return Response({
                        'url': file_url,
                        'message': 'Room design generated successfully'
                    }, status=status.HTTP_200_OK)
                    
                except Exception as e:
                    logger.error(f"Error uploading to S3: {str(e)}")
                    return Response(
                        {'error': 'Failed to upload generated image'}, 
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Error in room design generation: {str(e)}")
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class Generate3DLayoutView(APIView):
    def post(self, request):
        try:
            # Configure Replicate client with API token
            replicate.Client(api_token=os.getenv('REPLICATE_API_TOKEN'))
            base = "Use this exact floor plan of **THE GIVEN ROOM** to generate a realistic 3D interior layout **ONLY FOR ONE GIVEN ROOM. DON'T ADD ANY OTHER ROOM**"
            serializer = Generate3DLayoutRequestSerializer(data=request.data)
            if serializer.is_valid():
                input_data = {
                "image": serializer.validated_data['image'],
                "prompt": serializer.validated_data['prompt'] + base,
                "structure": "hed",
                "image_resolution": 512,
                "num_outputs": 1,
                "scale": 15,
                "steps": 20,
                "negative_prompt": "empty room, no furniture, missing objects, blank space, extra rooms",
            }

                try:
                    logger.info(f"Sending request to Replicate API with image: {input_data['image'][:100]}...")
                    output = replicate.run(
                        "rossjillian/controlnet:795433b19458d0f4fa172a7ccf93178d2adb1cb8ab2ad6c8fdc33fdbcd49f477",
                        input=input_data
                    )

                    image_urls = []
                    for index, item in enumerate(output):
                        # Generate a unique filename using UUID
                        filename = f"generated_layouts/{uuid.uuid4()}.png"
                        
                        # Upload to S3
                        try:
                            s3_client.put_object(
                                Bucket=AWS_BUCKET_NAME,
                                Key=filename,
                                Body=item.read(),
                                ContentType='image/png'
                            )
                            
                            # Generate the S3 URL
                            s3_url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{filename}"
                            image_urls.append(s3_url)
                            
                        except Exception as e:
                            logger.error(f"Error uploading to S3: {str(e)}")
                            raise Exception("Failed to upload generated image to S3")

                    return Response({"message": "3D layout generated successfully", "image_urls": image_urls}, status=status.HTTP_200_OK)

                except Exception as e:
                    print(str(e))
                    print(f"Error generating 3D layout: {str(e)}")
                    return Response({"error": "Failed to generate 3D layout"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            print("Invalid data received")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(str(e))
            print(f"Error handling request: {str(e)}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DesignStyleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DesignStyle.objects.all()
    serializer_class = DesignStyleSerializer

class InteriorDesignViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = InteriorDesign.objects.all()
    serializer_class = InteriorDesignSerializer

@api_view(['POST'])
def generate_design(request):
    try:
        # Validate request data
        serializer = DesignGenerationRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Save floor plan
        floor_plan_image = serializer.validated_data['floor_plan_image']
        file_name = f"floorplans/{time.time()}_{floor_plan_image.name}"
        file_path = default_storage.save(file_name, floor_plan_image)
        
        # Create floor plan record
        floor_plan = FloorPlan.objects.create(
            image=file_path,
            room_type=serializer.validated_data['room_type'],
            area_sqft=serializer.validated_data['area_sqft']
        )
        
        # Create design preferences
        preferences = DesignPreference.objects.create(
            floor_plan=floor_plan,
            style=serializer.validated_data['style'],
            color_scheme=serializer.validated_data['color_scheme'],
            budget_level=serializer.validated_data['budget_level'],
            lighting_preference=serializer.validated_data['lighting_preference'],
            additional_notes=serializer.validated_data.get('additional_notes', '')
        )
        
        # Create interior design record
        interior_design = InteriorDesign.objects.create(
            floor_plan=floor_plan,
            preferences=preferences,
            status='processing'
        )
        
        try:
            # Start timing
            start_time = time.time()
            
            # Generate interior design
            generated_image_path, prompt = generate_interior_design(
                floor_plan.image.path,
                {
                    'style': preferences.style,
                    'floor_plan': floor_plan,
                    'color_scheme': preferences.color_scheme,
                    'budget_level': preferences.budget_level,
                    'lighting_preference': preferences.lighting_preference,
                    'additional_notes': preferences.additional_notes
                }
            )
            
            # Update interior design record
            # Convert PosixPath to string and handle path properly
            relative_path = os.path.relpath(str(generated_image_path), settings.MEDIA_ROOT)
            interior_design.generated_image = relative_path
            interior_design.prompt_used = prompt
            interior_design.processing_time = time.time() - start_time
            interior_design.status = 'completed'
            interior_design.save()
            
            return Response(
                InteriorDesignSerializer(interior_design).data,
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            interior_design.status = 'failed'
            interior_design.save()
            return Response({
                'error': f'Design generation failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    except Exception as e:
        return Response({
            'error': f'Request processing failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)