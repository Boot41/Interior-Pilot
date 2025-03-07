from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DesignStyleViewSet, InteriorDesignViewSet, generate_design, Generate3DLayoutView, UploadImageView, RoomDesignView

router = DefaultRouter()
router.register(r'styles', DesignStyleViewSet)
router.register(r'designs', InteriorDesignViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('generate/', generate_design, name='generate'),
    path('generate-3d-layout/', Generate3DLayoutView.as_view(), name='generate-3d-layout'),
    path('upload-image/', UploadImageView.as_view(), name='upload-image'),
    path('room-design/', RoomDesignView.as_view(), name='room-design'),
]
