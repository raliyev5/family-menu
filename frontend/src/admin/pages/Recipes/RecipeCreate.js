import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Upload, message, Select, Transfer } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const RecipeCreate = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8000/api/users/')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                message.error('There was an error fetching the users');
                console.error("There was an error!", error);
            });

        axios.get('http://localhost:8000/api/products/')
            .then(response => {
                setProducts(response.data.map(product => ({
                    key: product.id,
                    title: product.name,
                    description: `${product.price} ${product.type}`,
                })));
            })
            .catch(error => {
                message.error('There was an error fetching the products');
                console.error("There was an error!", error);
            });
    }, []);

    const handleSubmit = async (values) => {
        const data = {
            name: values.name,
            author: values.author,
            chef: values.chef,
            product_ids: selectedProducts
        };

        console.log("Selected products before submit:", selectedProducts);
        console.log("Submitting data:", data);

        try {
            const response = await axios.post('http://localhost:8000/api/recipes/', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (fileList.length > 0) {
                const formData = new FormData();
                formData.append('image', fileList[0].originFileObj);

                await axios.patch(`http://localhost:8000/api/recipes/${response.data.id}/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            message.success('Recipe created successfully');
            navigate('/admin/recipes');
            form.resetFields();
            setFileList([]);
            setSelectedProducts([]);
        } catch (error) {
            if (error.response && error.response.data) {
                message.error(`There was an error creating the recipe: ${JSON.stringify(error.response.data)}`);
            } else {
                message.error('There was an error creating the recipe');
            }
            console.error("There was an error!", error);
        }
    };

    const handleChange = ({ fileList }) => setFileList(fileList);

    const handleTransferChange = (targetKeys, direction, moveKeys) => {
        console.log("Target keys (selected products):", targetKeys);
        console.log("Direction:", direction);
        console.log("Move keys:", moveKeys);
        setSelectedProducts(targetKeys);
    };

    useEffect(() => {
        console.log("Updated selected products:", selectedProducts);
    }, [selectedProducts]);

    return (
        <Card title="Create Recipe">
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="author" label="Author" rules={[{ required: true, message: 'Please choose the author!' }]}>
                    <Select>
                        {users.map(user => (
                            <Option key={user.id} value={user.id}>{user.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="chef" label="Chef" rules={[{ required: true, message: 'Please choose the chef!' }]}>
                    <Select>
                        {users.map(user => (
                            <Option key={user.id} value={user.id}>{user.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Products">
                    <Transfer
                        dataSource={products}
                        showSearch
                        targetKeys={selectedProducts}
                        onChange={handleTransferChange}
                        render={item => `${item.title} - ${item.description}`}
                    />
                </Form.Item>
                <Form.Item label="Image">
                    <Upload
                        listType="picture"
                        fileList={fileList}
                        onChange={handleChange}
                        beforeUpload={() => false}
                    >
                        <Button icon={<UploadOutlined />}>Select Photo</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="default" href="/admin/recipes">
                        Назад
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Create Recipe
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default RecipeCreate;
