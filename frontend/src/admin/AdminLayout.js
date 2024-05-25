import React from 'react';
import { Layout } from 'antd';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';
import AdminContent from './components/AdminContent';
import './Admin.css';

const AdminLayout = ({ children }) => (
    <Layout>
        <AdminHeader />
        <Layout>
            <AdminSidebar />
            <AdminContent>{children}</AdminContent>
        </Layout>
    </Layout>
);

export default AdminLayout;
