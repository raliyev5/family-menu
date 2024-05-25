import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UserEdit = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Загрузка данных пользователя
        axios.get(`http://localhost:8000/api/users/${id}/`)
            .then(response => {
                const user = response.data;
                form.setFieldsValue({
                    name: user.name,
                    email: user.email,
                });
                if (user.photo) {
                    setFileList([{
                        uid: '-1',
                        name: 'photo.png',
                        status: 'done',
                        url: user.photo,
                    }]);
                }
            })
            .catch(error => {
                message.error('There was an error loading the user data');
                console.error("There was an error!", error);
            });
    }, [id, form]);

    const handleSubmit = (values) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        if (values.password) {
            formData.append('password', values.password);
        }
        if (fileList.length > 0 && fileList[0].originFileObj) {
            formData.append('photo', fileList[0].originFileObj);
        }

        axios.put(`http://localhost:8000/api/users/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            message.success('User updated successfully');
            navigate('/admin/users');
        })
        .catch(error => {
            message.error('There was an error updating the user');
            console.error("There was an error!", error);
        });
    };

    const handleChange = ({ fileList }) => setFileList(fileList);

    return (
        <div >
            <Card title="Edit User" >
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <div className="form-row">
                        <Form.Item name="name" label="Name" className="form-item" rules={[{ required: true, message: 'Please input the name!' }]}>
                            <Input className="input-field" type="text" />
                        </Form.Item>
                        <Form.Item name="email" label="Email" className="form-item" rules={[{ required: true, message: 'Please input the email!' }]}>
                            <Input className="input-field" type="email" />
                        </Form.Item>
                        <Form.Item name="password" label="Password" className="form-item" rules={[{ required: false }]}>
                            <Input className="input-field" type="password" />
                        </Form.Item>
                    </div>
                    <div className="upload-container">
                        <Form.Item label="Photo">
                            <Upload
                                className="input-field"
                                listType="picture"
                                fileList={fileList}
                                onChange={handleChange}
                                beforeUpload={() => false}
                            >
                                <Button icon={<UploadOutlined />}>Select Photo</Button>
                            </Upload>
                        </Form.Item>
                    </div>
                    <Form.Item>
                            <Button type="default" href="/admin/users">
                                Назад
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Update User
                            </Button>
                        </Form.Item>

                </Form>
            </Card>
        </div>
    );
};

export default UserEdit;
