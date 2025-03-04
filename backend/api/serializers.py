from rest_framework import serializers
from .models import FloorPlan, InteriorDesign, DesignStyle, DesignPreference

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

class DesignGenerationRequestSerializer(serializers.Serializer):
    floor_plan_image = serializers.ImageField()
    room_type = serializers.ChoiceField(choices=FloorPlan._meta.get_field('room_type').choices)
    area_sqft = serializers.IntegerField(min_value=50)
    style = serializers.PrimaryKeyRelatedField(queryset=DesignStyle.objects.all())
    color_scheme = serializers.CharField(max_length=100)
    budget_level = serializers.ChoiceField(
        choices=DesignPreference._meta.get_field('budget_level').choices
    )
    lighting_preference = serializers.ChoiceField(
        choices=DesignPreference._meta.get_field('lighting_preference').choices
    )
    additional_notes = serializers.CharField(required=False, allow_blank=True)
