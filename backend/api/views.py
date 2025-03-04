import os
import time
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from django.conf import settings
from .models import FloorPlan, InteriorDesign, DesignStyle, DesignPreference
from .serializers import (
    FloorPlanSerializer, InteriorDesignSerializer, DesignStyleSerializer,
    DesignPreferenceSerializer, DesignGenerationRequestSerializer
)
from .utils import generate_interior_design

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