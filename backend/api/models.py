from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class DesignStyle(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

class FloorPlan(models.Model):
    image = models.ImageField(upload_to="floorplans/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    room_type = models.CharField(max_length=50, choices=[
        ('living_room', 'Living Room'),
        ('bedroom', 'Bedroom'),
        ('kitchen', 'Kitchen'),
        ('bathroom', 'Bathroom'),
        ('dining_room', 'Dining Room'),
        ('office', 'Office')
    ],
    default='living_room'
)
    area_sqft = models.IntegerField(default=50)

    def __str__(self):
        return f"{self.room_type} - {self.uploaded_at}"

class DesignPreference(models.Model):
    floor_plan = models.OneToOneField(FloorPlan, on_delete=models.CASCADE)
    style = models.ForeignKey(DesignStyle, on_delete=models.PROTECT)
    color_scheme = models.CharField(max_length=100)
    budget_level = models.CharField(max_length=20, choices=[
        ('budget', 'Budget'),
        ('mid_range', 'Mid Range'),
        ('luxury', 'Luxury')
    ])
    lighting_preference = models.CharField(max_length=20, choices=[
        ('bright', 'Bright'),
        ('moderate', 'Moderate'),
        ('dim', 'Dim')
    ])
    additional_notes = models.TextField(blank=True)

class InteriorDesign(models.Model):
    floor_plan = models.ForeignKey(FloorPlan, on_delete=models.CASCADE)
    preferences = models.OneToOneField(DesignPreference, on_delete=models.CASCADE, null=True)
    generated_image = models.ImageField(upload_to="designs/")
    edge_map = models.ImageField(upload_to="edge_maps/", null=True)
    prompt_used = models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    processing_time = models.FloatField(null=True)
    status = models.CharField(max_length=20, choices=[
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed')
    ], default='processing')

    def __str__(self):
        return f"Design for {self.floor_plan.room_type} - {self.created_at}"
