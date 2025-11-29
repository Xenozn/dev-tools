// src/components/Layout/Sidebar.tsx
import {Home, Hash, FileText, Palette, Settings} from 'lucide-react';
import {useLocation, useNavigate} from 'react-router-dom';

interface SidebarProps {
    activePage?: string
}

export default function Sidebar({}: SidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname.substring(1) || 'home'; // "/token" → "token"

    const menuItems = [
        {id: 'home', label: 'Accueil', icon: Home, path: '/'},
        {id: 'token', label: 'Token gen', icon: Hash, path: '/token'},
        {id: 'qrcode', label: 'QR Code', icon: FileText, path: '/qrcode'},
        {id: 'colors', label: 'Couleurs', icon: Palette, path: '/colors'},
        {id: 'settings', label: 'Paramètres', icon: Settings, path: '/settings'},
    ];

    return (
        <aside
            className="fixed top-0 left-0 h-screen w-64 bg-[#0f0f0f] text-white flex flex-col border-r border-[#1f1f1f]">
            {/* Logo / Titre */}
            <div className="p-6 border-b border-[#1f1f1f]">
                <h1 className="text-2xl font-bold text-green-500 mb-1">DevTools</h1>
                <p className="text-sm text-gray-500">Multi-tools pour devs</p>
            </div>

            {/* Menu */}
            <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPath === item.id; // Compare avec l'ID (ex: "token")

                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => navigate(item.path)} // Navigue vers le path
                                    className={`
                                        w-full flex items-center gap-3 px-4 py-3
                                        text-left transition-all
                                        border-l-2
                                        ${isActive
                                        ? 'bg-[#161616] text-white border-green-500'
                                        : 'text-gray-400 border-transparent hover:bg-[#151515] hover:text-white'
                                    }
                                    `}
                                >
                                    <Icon className="w-5 h-5 shrink-0"/>
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-[#1f1f1f]">
                <p className="text-xs text-gray-600 text-center">
                    Made with ❤️ by Xenozn_
                </p>
            </div>
        </aside>
    );
}
