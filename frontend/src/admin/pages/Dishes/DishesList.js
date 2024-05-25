import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Card, Button, message, Popconfirm, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const DishesList = () => {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDishes();
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

    const fetchDishes = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/api/dishes/');
            const dishesWithNames = await Promise.all(response.data.map(async (dish) => {
                const authorResponse = await axios.get(`http://localhost:8000/api/users/${dish.author}`);
                const chefResponse = await axios.get(`http://localhost:8000/api/users/${dish.chef}`);
                return {
                    ...dish,
                    authorName: authorResponse.data.name, // Add authorName property
                    chefName: chefResponse.data.name, // Add chefName property
                };
            }));
            setDishes(dishesWithNames);
            setLoading(false);
        } catch (error) {
            console.error("There was an error fetching the dishes!", error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/dishes/${id}/`);
            message.success('Dish deleted successfully');
            fetchDishes(); // Refresh the dishes list
        } catch (error) {
            console.error("There was an error deleting the dish!", error);
            message.error('Failed to delete dish');
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
                        onClick={() => navigate(`/admin/dishes/edit/${record.id}`)}
                        style={{ marginRight: 8 }}
                    />
                    <Popconfirm
                        title="Are you sure delete this dish?"
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
        <Card title="Dishes" style={{ margin: 20 }}>
            <Button type="default" href="/admin/dishes/create" style={{ marginBottom: '24px' }}>
                <PlusOutlined /> Добавить новое блюдо
            </Button>
            <Table
                dataSource={dishes}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
            />
        </Card>
    );
};

export default DishesList;
