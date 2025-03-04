from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DesignStyleViewSet, InteriorDesignViewSet, generate_design

router = DefaultRouter()
router.register(r'styles', DesignStyleViewSet)
router.register(r'designs', InteriorDesignViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('generate/', generate_design, name='generate_design'),
]
