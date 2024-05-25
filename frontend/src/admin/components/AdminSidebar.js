import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link } from 'react-router-dom';
import { DashboardOutlined, UserOutlined, LaptopOutlined, FormOutlined, AlertOutlined, CoffeeOutlined } from '@ant-design/icons';
import '../css/AdminSidebar.css'; // Импортируем файл CSS


const { Sider } = Layout;
const { SubMenu } = Menu;

const AdminSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} width={250} className="admin-sidebar">

            <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                style={{ height: '100%', borderRight: 0 }}
            >
                <Menu.Item key="main" icon={<DashboardOutlined />}>
                    <Link to="/admin/">Главная страница</Link>
                </Menu.Item>
                <Menu.Item key="users" icon={<UserOutlined />}>
                    <Link to="/admin/users">Пользователи</Link>
                </Menu.Item>
                <Menu.Item key="producs" icon={<CoffeeOutlined />}>
                    <Link to="/admin/products">Продукты</Link>
                </Menu.Item>
                <Menu.Item key="recipes" icon={<FormOutlined />}>
                    <Link to="/admin/recipes">Рецепты</Link>
                </Menu.Item>
                <Menu.Item key="dishes" icon={<AlertOutlined />}>
                    <Link to="/admin/dishes">Блюда</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default AdminSidebar;
