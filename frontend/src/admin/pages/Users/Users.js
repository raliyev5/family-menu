import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Card, Button, message, Popconfirm, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);



    const fetchUsers = () => {
        setLoading(true);
        axios.get('http://localhost:8000/api/users/')
            .then(response => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the users!", error);
                setLoading(false);
            });
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8000/api/users/${id}/`)
            .then(() => {
                message.success('User deleted successfully');
                fetchUsers(); // Refresh the user list
            })
            .catch(error => {
                console.error("There was an error deleting the user!", error);
                message.error('Failed to delete user');
            });
    };



    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: {
              compare: (a, b) => a.id - b.id,
              multiple: 1,
            },
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Photo',
            dataIndex: 'photo',
            key: 'photo',
            render: (text, record) => (
                <Avatar src={record.photo} />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <span>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/users/edit/${record.id}`)}
                        style={{ marginRight: 8 }}
                    />
                    <Popconfirm
                        title="Are you sure delete this user?"
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
        <Card title="Users" style={{ margin: 20 }}>

        <Button type="default" href="/admin/users/create" style={{ marginBottom: '24px' }}><PlusOutlined />
                        Создать нового пользователя
                    </Button>
            <Table
                dataSource={users}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
            />
        </Card>
    );
};

export default UserList;
