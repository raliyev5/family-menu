import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Card, Button, message, Popconfirm, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const RecipesList = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecipes();
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/users/');
            setUsers(response.data);
        } catch (error) {
            message.error('There was an error fetching the users');
            console.error("There was an error!", error);
        }
    };

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/api/recipes/');
            const recipesWithNames = await Promise.all(response.data.map(async (recipe) => {
                const authorResponse = await axios.get(`http://localhost:8000/api/users/${recipe.author}`);
                const chefResponse = await axios.get(`http://localhost:8000/api/users/${recipe.chef}`);
                return {
                    ...recipe,
                    authorName: authorResponse.data.name, // Add authorName property
                    chefName: chefResponse.data.name, // Add chefName property
                };
            }));
            setRecipes(recipesWithNames);
            setLoading(false);
        } catch (error) {
            console.error("There was an error fetching the recipes!", error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/recipes/${id}/`);
            message.success('Recipe deleted successfully');
            fetchRecipes(); // Refresh the recipes list
        } catch (error) {
            console.error("There was an error deleting the recipe!", error);
            message.error('Failed to delete recipe');
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Total price',
            dataIndex: 'total_price',
            key: 'total_price',
        },
        {
            title: 'Author',
            dataIndex: 'authorName',
            key: 'authorName',
        },
        {
            title: 'Chef',
            dataIndex: 'chefName',
            key: 'chefName',
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (text, record) => (
                <Avatar src={record.image} />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <span>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/recipes/edit/${record.id}`)}
                        style={{ marginRight: 8 }}
                    />
                    <Popconfirm
                        title="Are you sure delete this recipe?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </span>
            ),
        },
    ];

    return (
        <Card title="Recipes" style={{ margin: 20 }}>
            <Button type="default" href="/admin/recipes/create" style={{ marginBottom: '24px' }}>
                <PlusOutlined /> Добавить новый рецепт
            </Button>
            <Table
                dataSource={recipes}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
            />
        </Card>
    );
};

export default RecipesList;
