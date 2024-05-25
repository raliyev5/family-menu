import React from 'react';
import { Layout, Typography } from 'antd';

const { Header } = Layout;
const { Title } = Typography;

const AdminHeader = () => (
    <Header className="admin-header" style={{ height: '48px', display: 'flex', alignItems: 'center' }}>
        <div className="logo" style={{ marginRight: '8px', height: '100%', display: 'flex', alignItems: 'center' }}>
            <img href="#" src="/images/menu_logo.png" alt="Logo" style={{ height: '32px' }} />
        </div>
        <Title level={4} style={{ color: '#fff', margin: 0 }}>Панель администратора</Title>
    </Header>
);

export default AdminHeader;
