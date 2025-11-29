import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { ColorPicker } from 'antd';
import {
    hexToRgba, rgbaToString, stringToRgba,
    hslToHex, hexToHsl,
    cmykToHex, hexToCmyk,
    hsvToHex, hexToHsv, parseHsvString, parseCmykString, parseHslString, parseHexString, rgbaToHex
} from "../utils/colorsconverter.ts";

export default function ColorsConverter() {
    const [colorHex, setColorHex] = useState("#ffffff");

    const conversions = useMemo(() => ({
        HEX: colorHex.toUpperCase(),
        RGBA: rgbaToString(hexToRgba(colorHex)),
        HSL: (() => {
            const { h,s,l } = hexToHsl(colorHex);
            return `hsl(${h}, ${s}%, ${l}%)`;
        })(),
        CMYK: (() => {
            const {c,m,y,k} = hexToCmyk(colorHex);
            return `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`;
        })(),
        HSV: (() => {
            const {h,s,v} = hexToHsv(colorHex);
            return `hsv(${h}, ${s}%, ${v}%)`;
        })()
    }), [colorHex]);

    const handleChange = (format: string, value: string) => {
        try {
            let hex = colorHex;
            if(format==="HEX") hex = parseHexString(value);
            else if(format==="RGBA") {
                const rgba = stringToRgba(value);
                hex = rgbaToHex(rgba);
            }
            else if(format==="HSL") hex = hslToHex(parseHslString(value));
            else if(format==="CMYK") hex = cmykToHex(parseCmykString(value));
            else if(format==="HSV") hex = hsvToHex(parseHsvString(value));

            setColorHex(hex);
        } catch(e) {
            toast.error("Format invalide");
        }
    };


    const copyToClipboard = (value:string, format:string)=>{
        navigator.clipboard.writeText(value);
        toast.success(`${format} copié !`);
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-[#111] border border-[#1b1b1b] rounded-2xl shadow-xl space-y-6">
            <h2 className="text-xl font-semibold text-white">Convertisseur bidirectionnel</h2>

            <div className="flex items-center gap-4">
                <ColorPicker
                    value={colorHex}
                    onChange={(c) => setColorHex(c.toHexString())}
                    disabledAlpha
                />
                <div className="text-white text-lg">{colorHex.toUpperCase()}</div>
            </div>

            <div
                className="w-full h-20 rounded-xl border border-[#222]"
                style={{ backgroundColor: conversions.RGBA }}
            ></div>

            {Object.entries(conversions).map(([format,value])=>(
                <div key={format} className="flex rounded-xl overflow-hidden border border-[#2a2a2a] bg-[#131313]">
                    <div className="px-4 py-3 bg-[#1a1a1a] text-[#cfcfcf] border-r border-[#2a2a2a]">{format}</div>
                    <input
                        className="flex-1 px-4 py-3 bg-[#131313] text-white font-mono opacity-80 outline-none"
                        value={value}
                        onChange={e=>handleChange(format,e.target.value)}
                    />
                    <button
                        onClick={()=>copyToClipboard(value,format)}
                        className="px-4 py-3 bg-[#1a1a1a] text-white hover:bg-[#222] border-l border-[#2a2a2a] transition"
                    >Copier</button>
                </div>
            ))}
        </div>
    )
}
