import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Upload, message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const ProductsCreate = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const navigate = useNavigate();
    const [types, setTypes] = useState([]);

    useEffect(() => {
        setTypes([
            { value: 'Фрукты', label: 'Фрукты' },
            { value: 'Овощи', label: 'Овощи' },
            { value: 'Мясо', label: 'Мясо' },
            { value: 'Рыба', label: 'Рыба' },
            { value: 'Молочные продукты', label: 'Молочные продукты' },
            { value: 'Зерновые и крупы', label: 'Зерновые и крупы' },
            { value: 'Специи', label: 'Специи' },
            { value: 'Масла и жиры', label: 'Масла и жиры' },
            // добавьте другие типы по мере необходимости
        ]);
    }, []);

    const handleSubmit = (values) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('price', parseInt(values.price, 10)); // Преобразование строки в целое число
        formData.append('type', values.type);
        if (fileList.length > 0) {
            formData.append('image', fileList[0].originFileObj);
        }

        axios.post('http://localhost:8000/api/products/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            message.success('Product created successfully');
            navigate('/admin/products');
            form.resetFields();
            setFileList([]);
        })
        .catch(error => {
            message.error('There was an error creating the product');
            console.error("There was an error!", error);
        });
    };

    const handleChange = ({ fileList }) => setFileList(fileList);

    return (
        <Card title="Create Product">
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input the price!' }]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Please select the type!' }]}>
                    <Select>
                        {types.map(type => (
                            <Option key={type.value} value={type.value}>{type.label}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Photo">
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
                    <Button type="default" href="/admin/products">
                        Назад
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Create Product
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default ProductsCreate;
