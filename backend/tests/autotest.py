import warnings

warnings.filterwarnings("ignore", category=UserWarning, module='urllib3')

import requests
import unittest


class UserAPITests(unittest.TestCase):
    base_url = "http://localhost:8000/api/users/"
    image_path = "/Users/raliyev/Downloads/logo-removebg-preview-2.png"

    def test_user_crud_operations(self):
        # Create a new user with a file upload
        user_data = {
            "email": "auto_test@example.com",
            "name": "Test User",
            "password": "password123"
        }
        with open(self.image_path, 'rb') as img_file:
            files = {
                'photo': img_file
            }
            create_response = requests.post(self.base_url, data=user_data, files=files)

        print(f"Create response status code: {create_response.status_code}")
        print(f"Create response text: {create_response.text}")
        self.assertEqual(create_response.status_code, 201)
        created_user = create_response.json()
        user_id = created_user['id']

        # Get the list of users
        get_list_response = requests.get(self.base_url)
        print(f"Get list response status code: {get_list_response.status_code}")
        print(f"Get list response text: {get_list_response.text}")
        self.assertEqual(get_list_response.status_code, 200)
        users = get_list_response.json()
        self.assertIn(created_user, users)

        # Update the created user with a new file upload
        updated_user_data = {
            "name": "Updated User",
            "email": "updated@example.com",
            "password": "newpassword123"
        }
        with open(self.image_path, 'rb') as img_file:
            files = {
                'photo': img_file
            }
            update_url = f"{self.base_url}{user_id}/"
            update_response = requests.put(update_url, data=updated_user_data, files=files)

        print(f"Update response status code: {update_response.status_code}")
        print(f"Update response text: {update_response.text}")
        self.assertEqual(update_response.status_code, 200)
        updated_user = update_response.json()
        self.assertEqual(updated_user['name'], updated_user_data['name'])

        # Get the updated user by ID
        get_user_url = f"{self.base_url}{user_id}/"
        get_user_response = requests.get(get_user_url)
        print(f"Get user by ID response status code: {get_user_response.status_code}")
        print(f"Get user by ID response text: {get_user_response.text}")
        self.assertEqual(get_user_response.status_code, 200)
        user = get_user_response.json()
        self.assertEqual(user['name'], updated_user_data['name'])

        # Delete the user
        delete_url = f"{self.base_url}{user_id}/"
        delete_response = requests.delete(delete_url)
        print(f"Delete response status code: {delete_response.status_code}")
        print(f"Delete response text: {delete_response.text}")
        self.assertEqual(delete_response.status_code, 204)

        # Verify the user is deleted
        get_deleted_user_response = requests.get(delete_url)
        print(f"Get deleted user response status code: {get_deleted_user_response.status_code}")
        print(f"Get deleted user response text: {get_deleted_user_response.text}")
        self.assertEqual(get_deleted_user_response.status_code, 404)


if __name__ == "__main__":
    unittest.main()
