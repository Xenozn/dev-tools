import { useEffect, useState } from "react";
import { generateToken } from "../utils/tokengenerator.ts";
import { toast } from 'react-toastify';
import { ReloadOutlined, CopyOutlined } from "@ant-design/icons";
import { Button } from "antd";

export default function TokenGenerator() {
    const [uppercase, setUppercase] = useState(true);
    const [lowercase, setLowercase] = useState(true);
    const [numbers, setNumbers] = useState(true);
    const [symbols, setSymbols] = useState(false);
    const [length, setLength] = useState(128);
    const [result, setResult] = useState("");

    useEffect(() => {
        const token = generateToken({
            uppercase,
            lowercase,
            numbers,
            symbols,
            length,
        });
        setResult(token);
    }, [uppercase, lowercase, numbers, symbols, length]);

    const handleCopy = () => {
        navigator.clipboard.writeText(result);
        toast.success("Token copié !");
    };

    const handleRefresh = () => {
        setResult(
            generateToken({
                uppercase,
                lowercase,
                numbers,
                symbols,
                length,
            })
        );
    };

    const toggleOptions = [
        { label: "Majuscules (ABC...)", value: uppercase, setter: setUppercase },
        { label: "Minuscules (abc...)", value: lowercase, setter: setLowercase },
        { label: "Chiffres (123...)", value: numbers, setter: setNumbers },
        { label: "Symboles (!-;...)", value: symbols, setter: setSymbols },
    ];

    return (
        <div className="max-w-md mx-auto p-6 bg-[#111] border border-[#1b1b1b] rounded-2xl shadow-xl space-y-6">
            <h2 className="text-xl font-semibold text-white">Générateur de Token</h2>

            {/* Options */}
            <div className="space-y-3">
                {toggleOptions.map((option, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl border border-[#222] cursor-pointer hover:border-[#2a2a2a] transition"
                        onClick={() => option.setter(!option.value)}
                    >
                        <span className="text-white">{option.label}</span>
                        <div
                            className={`
                                w-12 h-6 rounded-full p-1 transition-all duration-300 cursor-pointer
                                ${option.value ? 'bg-[#00C951]' : 'bg-[#2a2a2a]'}
                            `}
                        >
                            <div
                                className={`
                                    w-4 h-4 rounded-full bg-white transition-transform duration-300
                                    ${option.value ? 'translate-x-6' : 'translate-x-0'}
                                `}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Length Slider */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-white">Longueur</label>
                    <div className="px-3 py-1 bg-[#1a1a1a] rounded-lg border border-[#222] text-white font-mono">
                        {length}
                    </div>
                </div>
                <input
                    type="range"
                    min={1}
                    max={512}
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full h-2 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer slider-thumb"
                    style={{
                        accentColor: '#00C951'
                    }}
                />
                <div className="flex justify-between text-xs text-gray-500">
                    <span>1</span>
                    <span>512</span>
                </div>
            </div>

            {/* Result */}
            <div className="space-y-2">
                <label className="text-white">Token généré</label>
                <textarea
                    value={result}
                    readOnly
                    className="
                        w-full h-32 resize-none p-4 rounded-xl
                        bg-[#131313] border border-[#2a2a2a]
                        text-white font-mono text-sm
                        focus:outline-none focus:ring-2 focus:ring-[#00ff80]
                    "
                />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
                <Button
                    type="primary"
                    icon={<CopyOutlined />}
                    onClick={handleCopy}
                    className="flex-1"
                    style={{
                        background: '#00C951',
                        borderColor: '#00C951',
                        height: '40px',
                        fontWeight: '500'
                    }}
                >
                    Copier
                </Button>

                <Button
                    icon={<ReloadOutlined />}
                    onClick={handleRefresh}
                    className="flex-1"
                    style={{
                        background: '#1a1a1a',
                        borderColor: '#2a2a2a',
                        color: 'white',
                        height: '40px',
                        fontWeight: '500'
                    }}
                >
                    Régénérer
                </Button>
            </div>
        </div>
    );
}
