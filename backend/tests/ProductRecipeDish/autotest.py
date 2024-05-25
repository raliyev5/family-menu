import warnings
warnings.filterwarnings("ignore", category=UserWarning, module='urllib3')

import requests
import unittest
import time

class ProductRecipeDishAPITests(unittest.TestCase):

    base_url = "http://localhost:8000/api/"
    image_path = "/Users/raliyev/Downloads/logo-removebg-preview-2.png"  # Замените на путь к вашему изображению

    def test_user_product_recipe_dish_crud_operations(self):
        timestamp = int(time.time())

        # Create a new user
        user_data = {
            "name": f"Test User_{timestamp}",
            "email": f"testuser_{timestamp}@example.com",
            "password": "password123"
        }
        with open(self.image_path, 'rb') as img_file:
            files = {
                'photo': img_file
            }
            create_user_response = requests.post(self.base_url + "users/", data=user_data, files=files)

        print(f"Create user response status code: {create_user_response.status_code}")
        print(f"Create user response text: {create_user_response.text}")
        self.assertEqual(create_user_response.status_code, 201)
        created_user = create_user_response.json()
        user_id = created_user['id']

        # Get all users
        get_users_response = requests.get(self.base_url + "users/")
        print(f"Get users response status code: {get_users_response.status_code}")
        print(f"Get users response text: {get_users_response.text}")
        self.assertEqual(get_users_response.status_code, 200)

        # Get the created user by ID
        get_user_response = requests.get(f"{self.base_url}users/{user_id}/")
        print(f"Get user by ID response status code: {get_user_response.status_code}")
        print(f"Get user by ID response text: {get_user_response.text}")
        self.assertEqual(get_user_response.status_code, 200)

        # Update the user
        updated_user_data = {
            "name": f"Updated User_{timestamp}",
            "email": f"updateduser_{timestamp}@example.com"
        }
        with open(self.image_path, 'rb') as img_file:
            files = {
                'photo': img_file
            }
            update_user_response = requests.put(f"{self.base_url}users/{user_id}/", data=updated_user_data, files=files)

        print(f"Update user response status code: {update_user_response.status_code}")
        print(f"Update user response text: {update_user_response.text}")
        self.assertEqual(update_user_response.status_code, 200)

        # Create a new product
        product_data = {
            "name": f"Test Product_{timestamp}",
            "price": 10,
            "type": "Фрукты"
        }
        with open(self.image_path, 'rb') as img_file:
            files = {
                'image': img_file
            }
            create_product_response = requests.post(self.base_url + "products/", data=product_data, files=files)

        print(f"Create product response status code: {create_product_response.status_code}")
        print(f"Create product response text: {create_product_response.text}")
        self.assertEqual(create_product_response.status_code, 201)
        created_product = create_product_response.json()
        product_id = created_product['id']

        # Get all products
        get_products_response = requests.get(self.base_url + "products/")
        print(f"Get products response status code: {get_products_response.status_code}")
        print(f"Get products response text: {get_products_response.text}")
        self.assertEqual(get_products_response.status_code, 200)

        # Get the created product by ID
        get_product_response = requests.get(f"{self.base_url}products/{product_id}/")
        print(f"Get product by ID response status code: {get_product_response.status_code}")
        print(f"Get product by ID response text: {get_product_response.text}")
        self.assertEqual(get_product_response.status_code, 200)

        # Update the product
        updated_product_data = {
            "name": f"Updated Product_{timestamp}",
            "price": 20,
            "type": "Овощи"
        }
        with open(self.image_path, 'rb') as img_file:
            files = {
                'image': img_file
            }
            update_product_response = requests.put(f"{self.base_url}products/{product_id}/", data=updated_product_data, files=files)

        print(f"Update product response status code: {update_product_response.status_code}")
        print(f"Update product response text: {update_product_response.text}")
        self.assertEqual(update_product_response.status_code, 200)

        # Create a new recipe with the product
        recipe_data = {
            "name": f"Test Recipe_{timestamp}",
            "product_ids": [product_id],  # Исправлено на product_ids
            "author": user_id,
            "chef": user_id
        }
        with open(self.image_path, 'rb') as img_file:
            files = {
                'image': img_file
            }
            create_recipe_response = requests.post(self.base_url + "recipes/", data=recipe_data, files=files)

        print(f"Create recipe response status code: {create_recipe_response.status_code}")
        print(f"Create recipe response text: {create_recipe_response.text}")
        self.assertEqual(create_recipe_response.status_code, 201)
        created_recipe = create_recipe_response.json()
        recipe_id = created_recipe['id']

        # Get all recipes
        get_recipes_response = requests.get(self.base_url + "recipes/")
        print(f"Get recipes response status code: {get_recipes_response.status_code}")
        print(f"Get recipes response text: {get_recipes_response.text}")
        self.assertEqual(get_recipes_response.status_code, 200)

        # Get the created recipe by ID
        get_recipe_response = requests.get(f"{self.base_url}recipes/{recipe_id}/")
        print(f"Get recipe by ID response status code: {get_recipe_response.status_code}")
        print(f"Get recipe by ID response text: {get_recipe_response.text}")
        self.assertEqual(get_recipe_response.status_code, 200)

        # Update the recipe
        updated_recipe_data = {
            "name": f"Updated Recipe_{timestamp}",
            "product_ids": [product_id],  # Исправлено на product_ids
            "author": user_id,
            "chef": user_id
        }
        with open(self.image_path, 'rb') as img_file:
            files = {
                'image': img_file
            }
            update_recipe_response = requests.put(f"{self.base_url}recipes/{recipe_id}/", data=updated_recipe_data, files=files)

        print(f"Update recipe response status code: {update_recipe_response.status_code}")
        print(f"Update recipe response text: {update_recipe_response.text}")
        self.assertEqual(update_recipe_response.status_code, 200)

        # Create a new dish with the recipe
        dish_data = {
            "name": f"Test Dish_{timestamp}",
            "recipe_ids": [recipe_id],  # Исправлено на recipe_ids
            "author": user_id,
            "chef": user_id
        }
        with open(self.image_path, 'rb') as img_file:
            files = {
                'image': img_file
            }
            create_dish_response = requests.post(self.base_url + "dishes/", data=dish_data, files=files)

        print(f"Create dish response status code: {create_dish_response.status_code}")
        print(f"Create dish response text: {create_dish_response.text}")
        self.assertEqual(create_dish_response.status_code, 201)
        created_dish = create_dish_response.json()
        dish_id = created_dish['id']

        # Get all dishes
        get_dishes_response = requests.get(self.base_url + "dishes/")
        print(f"Get dishes response status code: {get_dishes_response.status_code}")
        print(f"Get dishes response text: {get_dishes_response.text}")
        self.assertEqual(get_dishes_response.status_code, 200)

        # Get the created dish by ID
        get_dish_response = requests.get(f"{self.base_url}dishes/{dish_id}/")
        print(f"Get dish by ID response status code: {get_dish_response.status_code}")
        print(f"Get dish by ID response text: {get_dish_response.text}")
        self.assertEqual(get_dish_response.status_code, 200)

        # Update the dish
        updated_dish_data = {
            "name": f"Updated Dish_{timestamp}",
            "recipe_ids": [recipe_id],  # Исправлено на recipe_ids
            "author": user_id,
            "chef": user_id
        }
        with open(self.image_path, 'rb') as img_file:
            files = {
                'image': img_file
            }
            update_dish_response = requests.put(f"{self.base_url}dishes/{dish_id}/", data=updated_dish_data, files=files)

        print(f"Update dish response status code: {update_dish_response.status_code}")
        print(f"Update dish response text: {update_dish_response.text}")
        self.assertEqual(update_dish_response.status_code, 200)

        # Delete the dish
        delete_dish_response = requests.delete(f"{self.base_url}dishes/{dish_id}/")
        print(f"Delete dish response status code: {delete_dish_response.status_code}")
        print(f"Delete dish response text: {delete_dish_response.text}")
        self.assertEqual(delete_dish_response.status_code, 204)

        # Delete the recipe
        delete_recipe_response = requests.delete(f"{self.base_url}recipes/{recipe_id}/")
        print(f"Delete recipe response status code: {delete_recipe_response.status_code}")
        print(f"Delete recipe response text: {delete_recipe_response.text}")
        self.assertEqual(delete_recipe_response.status_code, 204)

        # Delete the product
        delete_product_response = requests.delete(f"{self.base_url}products/{product_id}/")
        print(f"Delete product response status code: {delete_product_response.status_code}")
        print(f"Delete product response text: {delete_product_response.text}")
        self.assertEqual(delete_product_response.status_code, 204)

        # Delete the user
        delete_user_response = requests.delete(f"{self.base_url}users/{user_id}/")
        print(f"Delete user response status code: {delete_user_response.status_code}")
        print(f"Delete user response text: {delete_user_response.text}")
        self.assertEqual(delete_user_response.status_code, 204)

if __name__ == "__main__":
    unittest.main()
