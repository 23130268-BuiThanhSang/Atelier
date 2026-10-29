import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles }) {
    // Lấy thông tin đăng nhập từ LocalStorage
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');

    // 1. Kiểm tra đăng nhập
    if (!userEmail) {
        return <Navigate to="/login" replace />;
    }

    // 2. Kiểm tra Quyền
    if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(userRole?.toUpperCase())) {
            return <Navigate to="/" replace />;
        }
    }
    return <Outlet />;
}