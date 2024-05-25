import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

const AdminContent = ({ children }) => (
    <Content className="admin-content">
        {children}
    </Content>
);

export default AdminContent;
