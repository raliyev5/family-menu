from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
import uuid
import os


def user_directory_path(instance, filename):
    # Файлы будут загружаться в MEDIA_ROOT/users/<user_id>/<filename>
    return f'users/{instance.id}/{filename}'


def product_directory_path(instance, filename):
    return f'products/{instance.id}/{filename}'


class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None):
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(email=self.normalize_email(email), name=name)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None):
        user = self.create_user(email, name, password)
        user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    photo = models.ImageField(upload_to='users/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin


class Product(models.Model):
    TYPE_CHOICES = [
        ('Фрукты', 'Фрукты'),
        ('Овощи', 'Овощи'),
        ('Мясо', 'Мясо'),
        ('Рыба', 'Рыба'),
        ('Молочные продукты', 'Молочные продукты'),
        ('Зерновые и крупы', 'Зерновые и крупы'),
        ('Специи', 'Специи'),
        ('Масла и жиры', 'Масла и жиры'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    price = models.IntegerField()
    type = models.CharField(max_length=255, choices=TYPE_CHOICES)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    is_active = models.BooleanField(default=True)


class Recipe(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    author = models.ForeignKey('User', related_name='authored_recipes', on_delete=models.CASCADE)
    chef = models.ForeignKey('User', related_name='cooked_recipes', on_delete=models.CASCADE)
    products = models.ManyToManyField('Product')
    total_price = models.IntegerField(default=0)
    image = models.ImageField(upload_to='recipes/', default='default/default.jpg')

    def calculate_total_price(self):
        return sum(product.price for product in self.products.all())

    def save(self, *args, **kwargs):
        self.total_price = self.calculate_total_price()
        super().save(*args, **kwargs)


class Dish(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    recipes = models.ManyToManyField('Recipe')
    total_price = models.IntegerField(default=0)
    author = models.ForeignKey('User', on_delete=models.CASCADE, related_name='authored_dishes')
    chef = models.ForeignKey('User', on_delete=models.CASCADE, related_name='cooked_dishes')
    image = models.ImageField(upload_to='dishes/', default='default/default.jpg')

    def calculate_total_price(self):
        return sum(recipe.total_price for recipe in self.recipes.all())

    def save(self, *args, **kwargs):
        self.total_price = self.calculate_total_price()
        super().save(*args, **kwargs)
