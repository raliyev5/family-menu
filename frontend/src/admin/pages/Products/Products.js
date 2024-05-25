import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Card, Button, message, Popconfirm, Avatar, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        setLoading(true);
        axios.get('http://localhost:8000/api/products/')
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the products!", error);
                setLoading(false);
            });
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8000/api/products/${id}/`)
            .then(() => {
                message.success('Product deleted successfully');
                fetchProducts(); // Refresh the user list
            })
            .catch(error => {
                console.error("There was an error deleting the product!", error);
                message.error('Failed to delete product');
            });
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
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => {
                let color;
                switch (type) {
                    case 'Фрукты':
                        color = 'magenta';
                        break
                    case 'Овощи':
                        color = 'green';
                        break;
                    case 'Мясо':
                        color = 'red';
                        break;
                    case 'Рыба':
                        color = 'blue';
                        break;
                    case 'Молочные продукты':
                        color = 'geekblue';
                        break;
                    case 'Зерновые и крупы':
                        color = 'gold';
                        break;
                    case 'Специи':
                        color = 'volcano';
                        break;
                    case 'Масла и жиры':
                        color = 'purple';
                        break;
                    default:
                        color = 'cyan';
                        break;
                }
                return <Tag color={color}>{type}</Tag>;
            }
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
                        onClick={() => navigate(`/admin/products/edit/${record.id}`)}
                        style={{ marginRight: 8 }}
                    />
                    <Popconfirm
                        title="Are you sure delete this product?"
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
        <Card title="Products" style={{ margin: 20 }}>

        <Button type="default" href="/admin/products/create" style={{ marginBottom: '24px' }}><PlusOutlined />
                        Добавить новый продукт
                    </Button>
            <Table
                dataSource={products}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
            />
        </Card>
    );
};

export default ProductsList;
