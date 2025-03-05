import requests
import base64
from PIL import Image
from io import BytesIO
import os
from typing import Dict, Any, Tuple, Optional
from django.conf import settings
from datetime import datetime
import uuid
import logging
import boto3
from botocore.exceptions import NoCredentialsError

logger = logging.getLogger(__name__)

def encode_image(image_path: str) -> str:
    """
    Encode an image file to base64 string
    """
    with open(image_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode('utf-8')

import requests
from django.conf import settings

def image_to_text(image_path: str) -> Dict[str, Any]:
    # Define the headers for the API request
    headers = {
        "Authorization": f"Bearer {settings.HF_API_KEY}",
    }

    # Prepare the files for the classification request
    data = {
        "image": encode_image(image_path)
    }

    # Classification request
    classification_url = "https://api-inference.huggingface.co/models/facebook/detr-resnet-50"
    classification_response = requests.post(classification_url, headers=headers, json=data)

    if classification_response.status_code != 200:
        raise Exception(f"Error in classification: {classification_response.text}")

    classification_result = classification_response.json()
    
    # Prepare the files for the segmentation request
    data2 = {
        "inputs": encode_image(image_path)
    }
    # Segmentation request
    segmentation_url = "https://api-inference.huggingface.co/models/facebook/detr-resnet-50-panoptic"
    segmentation_response = requests.post(segmentation_url, headers=headers, json=data2)

    if segmentation_response.status_code != 200:
        raise Exception(f"Error in segmentation: {segmentation_response.text}")

    segmentation_result = segmentation_response.json()

    return {
        "classification": classification_result,
        "segmentation": segmentation_result
    }

def generate_prompt(preferences: Dict[str, Any], layout_description: str = "") -> str:
    """
    Generate a detailed prompt based on user preferences and room layout
    """
    style = preferences['style'].name
    room_type = preferences['floor_plan'].room_type.replace('_', ' ').title()
    color_scheme = preferences['color_scheme']
    budget_level = preferences['budget_level'].replace('_', ' ').title()
    lighting = preferences['lighting_preference']
    
    base_prompt = f"Generate a highly realistic 3D-rendered {room_type} interior design"
    style_prompt = f"in {style} style with {color_scheme} color scheme"
    details = f"{lighting} lighting and {budget_level} quality furniture and decor"
    
    # Add layout description if available
    layout_info = f"\n\nBased on this layout: {layout_description}" if layout_description else ""
    
    # Add additional requirements
    additional = f"\n\nAdditional requirements: {preferences['additional_notes']}" if preferences['additional_notes'] else ""
    
    quality_prompt = "\n\nEnsure the rendering is highly detailed, using realistic textures, proper lighting, and soft shadows. Create a photorealistic architectural visualization in 8k resolution."
    
    negative_prompt = "low quality, blurry, distorted, unrealistic, poorly lit, anime, cartoon, sketch, drawing"
    
    return {
        "prompt": f"{base_prompt} {style_prompt}, {details}{layout_info}{additional}. {quality_prompt}",
        "negative_prompt": negative_prompt
    }

def text_to_image(prompt: str, negative_prompt: str) -> bytes:
    """
    Generate an image from text using Stable Diffusion XL
    """
    url = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
    headers = {"Authorization": f"Bearer {settings.HF_API_KEY}"}
    
    payload = {
        "inputs": prompt,
        "parameters": {
            "negative_prompt": negative_prompt,
            "num_inference_steps": 30,
            "guidance_scale": 7.5
        }
    }

    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    
    return response.content

def generate_interior_design(image_path: str, preferences: Dict[str, Any]) -> Tuple[str, str]:
    """
    Generate interior design using the complete pipeline
    """
    print(image_path)
    try:
        # Get room layout description
        layout_description = image_to_text(image_path)
        
        # Generate prompt
        prompt_data = generate_prompt(preferences, layout_description)
        
        # Generate image
        image_content = text_to_image(prompt_data["prompt"], prompt_data["negative_prompt"])
        
        # Save the generated image
        output_path = str(image_path).replace('floorplans', 'designs')
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        img = Image.open(BytesIO(image_content))
        img.save(output_path, format='PNG')
        
        return output_path, prompt_data["prompt"]
        
    except requests.exceptions.RequestException as e:
        error_msg = str(e)
        if hasattr(e, 'response'):
            try:
                error_data = e.response.json()
                if 'error' in error_data:
                    if 'estimated_time' in error_data:
                        print(f"Model is loading, waiting {error_data['estimated_time']} seconds...")
                        import time
                        time.sleep(float(error_data['estimated_time']))
                        return generate_interior_design(image_path, preferences)
                    error_msg = error_data['error']
            except:
                pass
        raise Exception(f"API Request failed: {error_msg}")
    except Exception as e:
        raise Exception(f"Failed to generate interior design: {str(e)}")

def upload_to_supabase(image_file):
    try:
        logger.info("Initializing S3 client for Supabase")
        
        # Initialize a session using Supabase S3 credentials
        s3 = boto3.client(
            service_name='s3',
            region_name=os.getenv('SUPERBASE_REGION'),
            endpoint_url=os.getenv('SUPERBASE_ENDPOINT'),
            aws_access_key_id=os.getenv('SUPERBASE_ACCESS_KEY'),
            aws_secret_access_key=os.getenv('SUPERBASE_SECRET_KEY')
        )

        with open("/home/usman/Downloads/layout.png", 'rb') as f:
            s3.upload_fileobj(f, Bucket=os.getenv('SUPERBASE_BUCKET'), Key=image_file.name)
        

    except NoCredentialsError:
        logger.error("Credentials not available.")
        raise Exception("Credentials not available.")
    except Exception as e:
        logger.error(f"Error uploading to Supabase: {str(e)}")
        raise Exception(f"Error uploading to Supabase: {str(e)}")