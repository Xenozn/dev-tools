import { useState } from "react";
import { toast } from "react-toastify";
import { hexToRgbA } from "../utils/colorsconverter";
import { Button } from 'antd';

export default function ColorsConverter() {
    const [color, setColor] = useState("#ffffff");

    const rgba = color ? hexToRgbA(color) : "";

    return (
        <div className="max-w-md mx-auto p-6 bg-[#111] border border-[#1b1b1b] rounded-2xl shadow-xl space-y-6">

            <h2 className="text-xl font-semibold text-white">Convertisseur Hex → RGBA</h2>
            <Button type="primary">Button</Button>
            {/* Sélecteur de couleur */}
            <div className="flex items-center gap-4">
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-14 h-14 rounded-md border border-[#222] cursor-pointer"
                />

                <div className="text-white text-lg">{color.toUpperCase()}</div>
            </div>

            {/* Preview couleur */}
            <div
                className="w-full h-20 rounded-xl border border-[#222]"
                style={{ backgroundColor: rgba }}
            ></div>

            {/* Section RGBA */}
            {/* Bloc HEX */}
            <div className="flex rounded-xl overflow-hidden border border-[#2a2a2a] bg-[#131313]">
                {/* Label à gauche */}
                <div className="px-4 py-3 bg-[#1a1a1a] text-[#cfcfcf] border-r border-[#2a2a2a]">
                    HEX
                </div>

                {/* Valeur */}
                <div className="flex-1 px-4 py-3 text-white font-mono opacity-80">
                    {color.toUpperCase()}
                </div>

                {/* Bouton copier */}
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(color);
                        toast.success("HEX copié !");
                    }}
                    className="px-4 py-3 bg-[#1a1a1a] text-white hover:bg-[#222] border-l border-[#2a2a2a] transition"
                >
                    Copier
                </button>
            </div>

            {/* Bloc RGBA */}
            <div className="flex rounded-xl overflow-hidden border border-[#2a2a2a] bg-[#131313]">
                {/* Label */}
                <div className="px-4 py-3 bg-[#1a1a1a] text-[#cfcfcf] border-r border-[#2a2a2a]">
                    RGBA
                </div>

                {/* Valeur */}
                <div className="flex-1 px-4 py-3 text-white font-mono opacity-80">
                    {rgba}
                </div>

                {/* Bouton copier */}
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(rgba);
                        toast.success("RGBA copié !");
                    }}
                    className="px-4 py-3 bg-[#1a1a1a] text-white hover:bg-[#222] border-l border-[#2a2a2a] transition"
                >
                    Copier
                </button>
            </div>

        </div>
    );
}
