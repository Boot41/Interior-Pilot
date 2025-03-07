from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import FloorPlan, DesignPreference, InteriorDesign, DesignStyle
from .serializers import DesignGenerationRequestSerializer
from unittest.mock import patch, Mock
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO


class ViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.floor_plan = FloorPlan.objects.create(
            room_type='living_room',
            area_sqft=500
        )
        self.design_preference = DesignPreference.objects.create(
            floor_plan=self.floor_plan,
            theme='Modern',
            color='White',
            additional_notes='Some notes'
        )
        self.image = SimpleUploadedFile(
            name='test_image.jpg',
            content=b'dummy image data',
            content_type='image/jpeg'
        )

    # Design Generation Tests
    @patch('api.views.replicate.Client')
    @patch('api.views.s3_client.put_object')

    def test_generate_design_invalid_data(self):
        """Test design generation with invalid data"""
        url = reverse('generate')
        data = {
            'image': '',
            'theme': '',
            'room_type': '',
            'color': ''
        }

        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('api.views.replicate.Client')
    def test_generate_design_api_error(self, mock_replicate):
        """Test handling of API errors"""
        mock_replicate.return_value.run.side_effect = Exception('API Error')

        url = reverse('generate')
        data = {
            'image': self.image,
            'theme': 'Modern',
            'room_type': 'living_room',
            'color': 'White',
            'additional_notes': 'Some notes'
        }

        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('api.views.s3_client.upload_fileobj')
    def test_upload_image_success(self, mock_upload):
        mock_upload.return_value = None
        with open('test_image.jpg', 'rb') as img:
            response = self.client.post(
                reverse('upload-image'),
                {'image': img},
                format='multipart'
            )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('url', response.data)

    def test_upload_image_missing_file(self):
        response = self.client.post(
            reverse('upload-image'),
            {},
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    @patch('api.views.s3_client.upload_fileobj')
    def test_upload_image_s3_failure(self, mock_upload):
        mock_upload.side_effect = Exception('S3 upload failed')
        with open('test_image.jpg', 'rb') as img:
            response = self.client.post(
                reverse('upload-image'),
                {'image': img},
                format='multipart'
            )
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn('error', response.data)

    def test_generate_design_hf_invalid_input(self):
        data = {
            'image': 'invalid',
            'theme': '',
            'room_type': '',
            'color': ''
        }
        response = self.client.post(
            reverse('generate'),
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('api.views.s3_client.upload_fileobj')
    def test_upload_s3_config_error(self, mock_upload):
        mock_upload.side_effect = Exception('S3 configuration error')
        with open('test_image.jpg', 'rb') as img:
            response = self.client.post(
                reverse('upload-image'),
                {'image': img},
                format='multipart'
            )
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

    @patch('api.views.replicate.Client')
    @patch('api.views.s3_client.put_object')
    def test_generate_design_missing_required_fields(self, mock_s3, mock_replicate):
        """Test design generation with missing required fields"""
        url = reverse('generate')
        data = {
            'theme': 'Modern',
            'room_type': 'living_room',
            'color': 'White'
        }

        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('api.views.replicate.Client')
    @patch('api.views.s3_client.put_object')
    def test_generate_design_invalid_image_format(self, mock_s3, mock_replicate):
        """Test design generation with invalid image format"""
        invalid_image = SimpleUploadedFile(
            name='test_image.txt',
            content=b'text content',
            content_type='text/plain'
        )

        url = reverse('generate')
        data = {
            'image': invalid_image,
            'theme': 'Modern',
            'room_type': 'living_room',
            'color': 'White',
            'additional_notes': 'Some notes'
        }

        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('api.views.replicate.Client')
    @patch('api.views.s3_client.put_object')
    def test_generate_design_serializer_error(self, mock_s3, mock_replicate):
        """
        Test that the API returns a 400 status code when a serializer error
        occurs. This should happen when one of the required fields is missing
        or empty.
        """
        mock_replicate.return_value.run.return_value = Mock(read=lambda: b'image_data')
        mock_s3.return_value = {}

        url = reverse('generate')
        data = {
            'image': self.image,
            'theme': '',  # Empty required field
            'room_type': 'living_room',
            'color': 'White',
            'additional_notes': 'Some notes'
        }

        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Room Design Tests
    @patch('api.views.replicate.Client')
    @patch('api.views.s3_client.put_object')
    def test_room_design_invalid_data(self):
        response = self.client.post(
            reverse('room-design'),
            {},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('errors', response.data)

    # List View Tests
    def test_get_design_styles(self):
        """Test retrieving design styles"""
        DesignStyle.objects.create(name='Modern', description='Modern style')

        url = reverse('designstyle-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_interior_designs(self):
        """Test retrieving interior designs"""
        InteriorDesign.objects.create(
            floor_plan=self.floor_plan,
            preferences=self.design_preference,
            status='pending'
        )

        url = reverse('interiordesign-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_floor_plans_error(self):
        """Test retrieving floor plans"""
        url = reverse('generate')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_design_style_pagination(self):
        for i in range(25):
            DesignStyle.objects.create(name=f'Style {i}', description=f'Description {i}')
        response = self.client.get(reverse('styles-list') + '?page=2&page_size=10')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 10)

    # 3D Layout Tests
    @patch('api.views.replicate.Client')
    def test_generate_3d_layout_failure(self, mock_replicate):
        """Test successful 3D layout generation"""
        mock_replicate.return_value.run.return_value = Mock(read=lambda: b'3d_data')
        url = reverse('generate-3d-layout')
        response = self.client.post(url, {
            'image': self.image,
            'prompt': 'Modern living room'
        }, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_generate_3d_layout_invalid_data(self):
        """Test 3D layout generation with invalid data"""
        url = reverse('generate-3d-layout')
        response = self.client.post(url, {
            'image': '',
            'prompt': ''
        }, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_generate_3d_layout_invalid_resolution(self):
        data = {
            'image': 'https://example.com/image.jpg',
            'prompt': 'modern living room',
            'image_resolution': 10000  # Invalid resolution
        }
        response = self.client.post(
            reverse('generate-3d-layout'),
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)


class ModelTests(TestCase):
    def test_create_floor_plan(self):
        """Test creating a floor plan"""
        floor_plan = FloorPlan.objects.create(
            room_type='living_room',
            area_sqft=500
        )
        self.assertEqual(str(floor_plan), f"living_room - {floor_plan.uploaded_at}")

    def test_create_design_preference(self):
        """Test creating design preferences"""
        floor_plan = FloorPlan.objects.create(room_type='bedroom', area_sqft=300)
        preferences = DesignPreference.objects.create(
            floor_plan=floor_plan,
            theme='Modern',
            color='White',
            additional_notes='Some notes'
        )
        self.assertEqual(str(preferences), f"Preferences for {floor_plan}")


class SerializerTests(TestCase):
    def test_design_generation_serializer_valid(self):
        """Test valid design generation serializer"""
        data = {
            'image': 'https://example.com/image.jpg',
            'theme': 'Modern',
            'room_type': 'living_room',
            'color': 'White',
            'additional_notes': 'Some notes'
        }
        serializer = DesignGenerationRequestSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_design_generation_serializer_invalid(self):
        """Test invalid design generation serializer"""
        data = {
            'image': '',
            'theme': '',
            'room_type': '',
            'color': ''
        }
        serializer = DesignGenerationRequestSerializer(data=data)
        self.assertFalse(serializer.is_valid())
