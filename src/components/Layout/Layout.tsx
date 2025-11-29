// src/components/Layout/Layout.tsx
import type {ReactNode} from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const location = useLocation();
    const currentPath = location.pathname.substring(1) || 'home'; // "/token" → "token"

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#0f0f0f] text-white">
            <ToastContainer theme="dark" />
            {/* SIDEBAR */}
            <Sidebar activePage={currentPath} />

            {/* CONTENT */}
            <div className="flex-1 ml-64 h-screen overflow-hidden">
                <main className="h-full overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
