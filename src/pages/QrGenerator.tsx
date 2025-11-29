import { useState } from "react";
import { QRCode } from "antd";
import { toast } from "react-toastify";

export default function QrGenerator() {
    const [color, setColor] = useState("#00C951");
    const [text, setText] = useState("https://devtools.vezinbastien.com");
    const [icon, setIcon] = useState<string | undefined>(undefined);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setIcon(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-[#111] border border-[#1b1b1b] rounded-2xl shadow-xl space-y-6">
            <h2 className="text-xl font-semibold text-white">Générateur de QR Code</h2>

            {/* QR Code */}
            <div className="flex justify-center p-4 bg-[#1a1a1a] rounded-xl border border-[#222]">
                <QRCode value={text}  color={color} icon={icon} />
            </div>

            {/* Texte du QR */}
            <div className="flex flex-col space-y-2">
                <label className="text-white">Texte / URL</label>
                <input
                    type="text"
                    placeholder="Entrez votre texte ou URL"
                    maxLength={120}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-[#00ff80]"
                />
            </div>

            {/* Upload icône */}
            <div className="flex flex-col space-y-2">
                <label className="text-white">Icône du QR</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-white cursor-pointer"
                />
            </div>



            {/* Couleur du QR */}
            <div className="flex items-center gap-4">
                <label className="text-white">Couleur</label>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-14 h-14 rounded-md border border-[#222] cursor-pointer"
                />
                <div className="text-white font-mono">{color.toUpperCase()}</div>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(color);
                        toast.success("Couleur copiée !");
                    }}
                    className="px-4 py-2 bg-[#1a1a1a] text-white rounded-xl border border-[#2a2a2a] hover:bg-[#222] transition"
                >
                    Copier
                </button>
            </div>
        </div>
    );
}
