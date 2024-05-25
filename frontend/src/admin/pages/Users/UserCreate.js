// src/admin/pages/UserCreate.js
import React, { useState } from 'react';
import { Card, Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const UserCreate = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    const handleSubmit = (values) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('password', values.password);
        if (fileList.length > 0) {
            formData.append('photo', fileList[0].originFileObj);
        }

        axios.post('http://localhost:8000/api/users/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            message.success('User created successfully');
            form.resetFields();
            setFileList([]);
        })
        .catch(error => {
            message.error('There was an error creating the user');
            console.error("There was an error!", error);
        });
    };

    const handleChange = ({ fileList }) => setFileList(fileList);

    return (
        <Card title="Create User">
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input the email!' }]}>
                    <Input type="email" />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please input the password!' }]}>
                    <Input.Password />
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
                        <Button  type="default" href="/admin/users">
                            Назад
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Create User
                        </Button>
                    </Form.Item>
            </Form>
        </Card>
    );
};

export default UserCreate;
