from rest_framework import serializers
from .models import FloorPlan, InteriorDesign, DesignStyle, DesignPreference

class DesignGenerationRequestSerializer(serializers.Serializer):
    image = serializers.URLField(required=True)
    theme = serializers.CharField(required=True)
    room_type = serializers.CharField(required=True)
    color = serializers.CharField(required=True)
    additional_notes = serializers.CharField(required=False, allow_blank=True)

class RoomDesignRequestSerializer(serializers.Serializer):
    image = serializers.URLField(required=True)
    theme = serializers.CharField(required=True)
    room_type = serializers.CharField(required=True)
    color = serializers.CharField(required=True)
    accessories = serializers.CharField(required=True)
    furniture = serializers.CharField(required=True)
    walls = serializers.CharField(required=True)
    lights = serializers.CharField(required=True)
    realistic = serializers.CharField(required=True)

class Generate3DLayoutRequestSerializer(serializers.Serializer):
    image = serializers.URLField(required=True)
    prompt = serializers.CharField(required=True)

class DesignStyleSerializer(serializers.ModelSerializer):
    class Meta:
        model = DesignStyle
        fields = ['id', 'name', 'description']

class FloorPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = FloorPlan
        fields = ['id', 'image', 'uploaded_at', 'room_type', 'area_sqft']

class DesignPreferenceSerializer(serializers.ModelSerializer):
    style_name = serializers.CharField(source='style.name', read_only=True)

    class Meta:
        model = DesignPreference
        fields = [
            'id', 'floor_plan', 'style', 'style_name', 'color_scheme',
            'budget_level', 'lighting_preference', 'additional_notes'
        ]

class InteriorDesignSerializer(serializers.ModelSerializer):
    floor_plan = FloorPlanSerializer(read_only=True)
    preferences = DesignPreferenceSerializer(read_only=True)
    status = serializers.CharField(read_only=True)

    class Meta:
        model = InteriorDesign
        fields = [
            'id', 'floor_plan', 'preferences', 'generated_image',
            'edge_map', 'prompt_used', 'created_at', 'processing_time',
            'status'
        ]

class RoomDesignRequestSerializer(serializers.Serializer):
    image = serializers.URLField(required=True)
    theme = serializers.CharField(required=True)
    room_type = serializers.CharField(required=True)
    color = serializers.CharField(required=True)
    accessories = serializers.CharField(required=True)
    furniture = serializers.CharField(required=True)
    walls = serializers.CharField(required=True)
    lights = serializers.CharField(required=True)
    realistic = serializers.CharField(required=True)
    additional_notes = serializers.CharField(required=False, allow_blank=True)
