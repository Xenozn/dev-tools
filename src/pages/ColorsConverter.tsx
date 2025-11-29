import { useEffect, useState } from "react";
import {generateToken} from "../utils/tokengenerator.ts";
import Toggle from "../components/Toggle.tsx";
import { toast } from 'react-toastify';


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

    return (
        <div className="max-w-4xl space-y-8 bg-[#131313] p-8 border border-[#1f1f1f]">

            {/* Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Toggle
                    label="Uppercase (ABC...)"
                    enabled={uppercase}
                    setEnabled={setUppercase}
                />

                <Toggle
                    label="Numbers (123...)"
                    enabled={numbers}
                    setEnabled={setNumbers}
                />

                <Toggle
                    label="Lowercase (abc...)"
                    enabled={lowercase}
                    setEnabled={setLowercase}
                />

                <Toggle
                    label="Symbols (!-;...)"
                    enabled={symbols}
                    setEnabled={setSymbols}
                />
            </div>

            {/* Length */}
            <div className="space-y-2">
                <p className="text-gray-400">Length ({length})</p>

                <input
                    type="range"
                    min={1}
                    max={512}
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full accent-green-500"
                />
            </div>

            {/* Result */}
            <textarea
                value={result}
                readOnly
                className="
          w-full h-32 resize-none p-4
          bg-[#1a1a1a]
          border border-[#262626]
          text-white
          focus:outline-none
        "
            />

            {/* Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={() => {navigator.clipboard.writeText(result); toast.success("Succès !")}}
                    className="bg-[#1f1f1f] border border-[#2a2a2a] px-6 py-2 text-white hover:border-green-500 transition"
                >
                    Copy
                </button>

                <button
                    onClick={() =>
                        setResult(
                            generateToken({
                                uppercase,
                                lowercase,
                                numbers,
                                symbols,
                                length,
                            })
                        )
                    }
                    className="bg-[#1f1f1f] border border-[#2a2a2a] px-6 py-2 text-white hover:border-green-500 transition"
                >
                    Refresh
                </button>
            </div>
        </div>
    );
}
