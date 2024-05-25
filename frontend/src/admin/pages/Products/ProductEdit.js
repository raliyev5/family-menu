import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, Upload, message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const { Option } = Select;


const ProductEdit = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const { id } = useParams();
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

    useEffect(() => {
        // Загрузка данных пользователя
        axios.get(`http://localhost:8000/api/products/${id}/`)
            .then(response => {
                const product = response.data;
                form.setFieldsValue({
                    name: product.name,
                    price: product.price,
                    type: product.type,
                });
                if (product.image) {
                    setFileList([{
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: product.image,
                    }]);
                }
            })
            .catch(error => {
                message.error('There was an error loading the product data');
                console.error("There was an error!", error);
            });
    }, [id, form]);

    const handleSubmit = (values) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('price', values.price);
        formData.append('type', values.type);
        if (fileList.length > 0 && fileList[0].originFileObj) {
            formData.append('image', fileList[0].originFileObj);
        }

        axios.put(`http://localhost:8000/api/products/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            message.success('Product updated successfully');
            navigate('/admin/products');
        })
        .catch(error => {
            message.error('There was an error updating the product');
            console.error("There was an error!", error);
        });
    };

    const handleChange = ({ fileList }) => setFileList(fileList);

    return (
        <div >
            <Card title="Edit Product" >
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <div className="form-row">
                        <Form.Item name="name" label="Name" className="form-item" rules={[{ required: true, message: 'Please input the name!' }]}>
                            <Input className="input-field" type="text" />
                        </Form.Item>
                        <Form.Item name="price" label="Price" className="form-item" rules={[{ required: true, message: 'Please input the email!' }]}>
                            <Input className="input-field" type="number" />
                        </Form.Item>
                        <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Please select the type!' }]}>
                            <Select>
                                {types.map(type => (
                                    <Option key={type.value} value={type.value}>{type.label}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="upload-container">
                        <Form.Item label="Image">
                            <Upload
                                className="input-field"
                                listType="picture"
                                fileList={fileList}
                                onChange={handleChange}
                                beforeUpload={() => false}
                            >
                                <Button icon={<UploadOutlined />}>Select image</Button>
                            </Upload>
                        </Form.Item>
                    </div>
                    <Form.Item>
                            <Button type="default" href="/admin/products">
                                Назад
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Update Product
                            </Button>
                        </Form.Item>

                </Form>
            </Card>
        </div>
    );
};

export default ProductEdit;
