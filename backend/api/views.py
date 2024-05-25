from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import User, Product, Recipe, Dish
from .serializers import UserSerializer, ProductSerializer, RecipeSerializer, DishSerializer
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import logging
import uuid

logger = logging.getLogger('api')


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    parser_classes = (MultiPartParser, FormParser)

    def update(self, request, *args, **kwargs):
        logging.debug(request.data)  # Логирование данных запроса
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    parser_classes = (MultiPartParser, FormParser)

    def update(self, request, *args, **kwargs):
        logging.debug(request.data)  # Логирование данных запроса
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        logger.debug("Received data in create: %s", request.data)

        request_data = request.data.copy()
        products_data = request_data.get('products')
        if products_data and isinstance(products_data, list):
            try:
                products_list = [uuid.UUID(prod) for prod in products_data]
                request_data['product_ids'] = products_list
            except ValueError:
                return Response({'error': 'Invalid UUID format for products'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        recipe = serializer.save()

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        logger.debug("Received data in update: %s", request.data)

        request_data = request.data.copy()
        products_data = request_data.get('products')
        if products_data and isinstance(products_data, list):
            try:
                products_list = [uuid.UUID(prod) for prod in products_data]
                request_data['product_ids'] = products_list
            except ValueError:
                return Response({'error': 'Invalid UUID format for products'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(instance, data=request_data, partial=partial)
        serializer.is_valid(raise_exception=True)
        recipe = serializer.save()

        return Response(serializer.data)




class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        logger.debug("Received data in create: %s", request.data)

        request_data = request.data.copy()
        recipes_data = request_data.get('recipes')
        if recipes_data and isinstance(recipes_data, list):
            try:
                recipes_list = [uuid.UUID(recipe) for recipe in recipes_data]
                request_data['recipe_ids'] = recipes_list
            except ValueError:
                return Response({'error': 'Invalid UUID format for recipes'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        dish = serializer.save()

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        logger.debug("Received data in update: %s", request.data)

        request_data = request.data.copy()
        recipes_data = request_data.get('recipes')
        if recipes_data and isinstance(recipes_data, list):
            try:
                recipes_list = [uuid.UUID(recipe) for recipe in recipes_data]
                request_data['recipe_ids'] = recipes_list
            except ValueError:
                return Response({'error': 'Invalid UUID format for recipes'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(instance, data=request_data, partial=partial)
        serializer.is_valid(raise_exception=True)
        dish = serializer.save()

        return Response(serializer.data)
