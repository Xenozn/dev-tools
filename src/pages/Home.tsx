// src/pages/Home.tsx
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();
    const tools = [
        {
            name: "Token generator",
            desc: "Generate random string with custom characters.",
            icon: "🔁",
            path: "/token",
        },{
            name: "Color Converter",
            desc: "Convert colors between different formats (HEX, RGBA).",
            icon: "🎨",
            path: "/colors",
        },{
            name: "Qr Code Generator",
            desc: "Generate QR codes with custom text and colors.",
            icon: "📇",
            path: "/qrcode",
        },
        // Ajoute d'autres outils ici
    ];

    return (
        <div className="mx-auto space-y-16 py-8 bg-[#0f0f0f] min-h-screen">
            {/* Hero Section */}
            <div className="space-y-6">
                <h1 className="text-6xl font-bold text-white">
                    Bienvenue sur <span className="text-green-500">DevTools</span>
                </h1>
                <p className="text-xl text-gray-400 leading-relaxed max-w-3xl">
                    Une collection d'outils essentiels pour les développeurs.
                </p>
            </div>

            {/* Tools Preview */}
            <div>
                <h2 className="text-3xl font-bold text-white mb-8">All the tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                    {tools.map((tool) => (
                        <div
                            key={tool.name}
                            onClick={() => navigate(tool.path)}
                            className="bg-[#131313] border border-[#222] p-5 transition-all hover:border-green-500/50 hover:bg-[#161616] cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="text-2xl opacity-50 group-hover:opacity-100 transition">
                                    {tool.icon}
                                </div>
                                <div className="text-gray-600 group-hover:text-green-500 transition">
                                    ❤
                                </div>
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-2">{tool.name}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{tool.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
