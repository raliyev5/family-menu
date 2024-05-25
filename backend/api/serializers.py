from rest_framework import serializers
from .models import User, Product, Recipe, Dish
import json
import logging

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'password', 'photo')
        extra_kwargs = {'password': {'write_only': True}}

        def validate(self, data):
            if self.instance is None and 'password' not in data:
                raise serializers.ValidationError("Password is required for new users.")
            if 'email' not in data or not data['email']:
                raise serializers.ValidationError("Email is required")
            if 'name' not in data or not data['name']:
                raise serializers.ValidationError("Name is required")
            return data

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            name=validated_data['name'],
            photo=validated_data.get('photo', None),
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.email = validated_data.get('email', instance.email)
        if 'photo' in validated_data:
            instance.photo = validated_data['photo']
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        instance.save()
        return instance


def validate(data):
    if 'name' not in data:
        raise serializers.ValidationError("Name is required for new users.")
    if 'email' not in data or not data['email']:
        raise serializers.ValidationError("Email is required")
    if 'name' not in data or not data['name']:
        raise serializers.ValidationError("Name is required")
    return data


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'image', 'name', 'price', 'type']

    def create(self, validated_data):
        return Product.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.price = validated_data.get('price', instance.price)
        instance.type = validated_data.get('type', instance.type)
        if 'image' in validated_data:
            instance.image = validated_data['image']
        instance.save()
        return instance



logger = logging.getLogger('api')



class RecipeSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)
    product_ids = serializers.ListField(
        child=serializers.UUIDField(format='hex_verbose'),
        write_only=True
    )

    class Meta:
        model = Recipe
        fields = ['id', 'name', 'author', 'chef', 'products', 'product_ids', 'image', 'total_price']

    def create(self, validated_data):
        products_data = validated_data.pop('product_ids')
        recipe = Recipe.objects.create(**validated_data)
        recipe.products.set(products_data)
        recipe.total_price = recipe.calculate_total_price()
        recipe.save()
        return recipe

    def update(self, instance, validated_data):
        products_data = validated_data.pop('product_ids', None)
        instance = super().update(instance, validated_data)
        if products_data:
            instance.products.set(products_data)
        instance.total_price = instance.calculate_total_price()
        instance.save()
        return instance



class DishSerializer(serializers.ModelSerializer):
    recipe_ids = serializers.ListField(
        child=serializers.UUIDField(format='hex_verbose'),
        write_only=True
    )
    recipes = RecipeSerializer(many=True, read_only=True)

    class Meta:
        model = Dish
        fields = ['id', 'name', 'author', 'chef', 'recipes', 'recipe_ids', 'image', 'total_price']

    def create(self, validated_data):
        recipes_data = validated_data.pop('recipe_ids')
        dish = Dish.objects.create(**validated_data)
        dish.recipes.set(recipes_data)
        dish.total_price = dish.calculate_total_price()
        dish.save()
        return dish

    def update(self, instance, validated_data):
        recipes_data = validated_data.pop('recipe_ids', None)
        instance = super().update(instance, validated_data)
        if recipes_data:
            instance.recipes.set(recipes_data)
        instance.total_price = instance.calculate_total_price()
        instance.save()
        return instance
