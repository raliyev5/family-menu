import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, Upload, message, Select, Transfer } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const { Option } = Select;

const DishEdit = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipes, setSelectedRecipes] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/users/')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                message.error('There was an error fetching the users');
                console.error("There was an error!", error);
            });

        axios.get('http://localhost:8000/api/recipes/')
            .then(response => {
                setRecipes(response.data.map(recipe => ({
                    key: recipe.id,
                    title: recipe.name,
                    description: `${recipe.price} ${recipe.type}`,
                })));
            })
            .catch(error => {
                message.error('There was an error fetching the recipes');
                console.error("There was an error!", error);
            });
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/dishes/${id}/`)
            .then(response => {
                const dish = response.data;
                form.setFieldsValue({
                    name: dish.name,
                    author: dish.author,
                    chef: dish.chef,
                });
                setSelectedRecipes(dish.recipes.map(recipe => recipe.id));
                if (dish.image) {
                    setFileList([{
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: dish.image,
                    }]);
                }
            })
            .catch(error => {
                message.error('There was an error loading the dish data');
                console.error("There was an error!", error);
            });
    }, [id, form]);

    const handleSubmit = async (values) => {
        const data = {
            name: values.name,
            author: values.author,
            chef: values.chef,
            recipe_ids: selectedRecipes
        };

        try {
            const response = await axios.put(`http://localhost:8000/api/dishes/${id}/`, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (fileList.length > 0 && fileList[0].originFileObj) {
                const formData = new FormData();
                formData.append('image', fileList[0].originFileObj);

                await axios.patch(`http://localhost:8000/api/dishes/${response.data.id}/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            message.success('Dish updated successfully');
            navigate('/admin/dishes');
            form.resetFields();
            setFileList([]);
            setSelectedRecipes([]);
        } catch (error) {
            message.error('There was an error updating the dish');
            console.error("There was an error!", error);
        }
    };

    const handleChange = ({ fileList }) => setFileList(fileList);

    return (
        <Card title="Edit Dish">
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
                <Form.Item label="Recipes">
                    <Transfer
                        dataSource={recipes}
                        showSearch
                        targetKeys={selectedRecipes}
                        onChange={setSelectedRecipes}
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
                    <Button type="default" href="/admin/dishes">
                        Назад
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update Recipe
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default DishEdit;
