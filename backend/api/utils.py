import requests
import base64
from PIL import Image
from io import BytesIO
import os
from typing import Dict, Any, Tuple, Optional
from django.conf import settings

def encode_image(image_path: str) -> str:
    """
    Encode an image file to base64 string
    """
    with open(image_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode('utf-8')

def image_to_text(image_path: str) -> str:
    """
    Get a description of the room layout from an image using BLIP model
    """
    url = "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large"
    headers = {"Authorization": f"Bearer {settings.HF_API_KEY}"}
    
    data = {
        "image": encode_image(image_path),
        "question": """Analyze the given image and describe the room layout in detail, including 
        the furniture arrangement, wall colors, flooring, lighting, and any decorative elements. 
        Also, mention the style of the room (modern, minimalistic, traditional, etc.). 
        If the image contains windows or doors, include their placement."""
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        
        result = response.json()
        if isinstance(result, list) and len(result) > 0:
            return result[0].get("generated_text", "")
        return ""
    except Exception as e:
        print(f"Error in image_to_text: {str(e)}")
        return ""

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