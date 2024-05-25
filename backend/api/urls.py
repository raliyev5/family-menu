# backend/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, ProductViewSet, RecipeViewSet, DishViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'products', ProductViewSet)
router.register(r'recipes', RecipeViewSet)
router.register(r'dishes', DishViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
