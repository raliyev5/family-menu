import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from './AdminLayout';

//Main
import Main from './pages/Main';

//Users
import UserList from './pages/Users/Users';
import UserCreate from './pages/Users/UserCreate';
import UserEdit from './pages/Users/UserEdit';

//Products
import ProductsList from './pages/Products/Products';
import ProductCreate from './pages/Products/ProductCreate';
import ProductEdit from './pages/Products/ProductEdit';

//Recipes
import RecipesList from './pages/Recipes/RecipesList';
import RecipeCreate from './pages/Recipes/RecipeCreate';
import RecipeEdit from './pages/Recipes/RecipeEdit';

//Dishes
import DishesList from './pages/Dishes/DishesList';
import DishCreate from './pages/Dishes/DishCreate';
import DishEdit from './pages/Dishes/DishEdit';


const Admin = () => (
    <AdminLayout>
        <Routes>
            <Route path="/" element={<Main />} />
            //Users
            <Route path="users" element={<UserList />} />
            <Route path="users/create" element={<UserCreate />} />
            <Route path="users/edit/:id" element={<UserEdit />} />
            //Products
            <Route path="products" element={<ProductsList />} />
            <Route path="products/create" element={<ProductCreate />} />
            <Route path="products/edit/:id" element={<ProductEdit />} />
            //Recipes
            <Route path="recipes" element={<RecipesList />} />
            <Route path="recipes/create" element={<RecipeCreate />} />
            <Route path="recipes/edit/:id" element={<RecipeEdit />} />

            //Dishes
            <Route path="dishes" element={<DishesList />} />
            <Route path="dishes/create" element={<DishCreate />} />
            <Route path="dishes/edit/:id" element={<DishEdit />} />
        </Routes>
    </AdminLayout>
);

export default Admin;
