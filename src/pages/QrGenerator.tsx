import { useState } from "react";
import {QRCode, Upload, Button, Segmented, ColorPicker} from "antd";
import type { UploadFile, UploadProps, QRCodeProps } from "antd";
import ImgCrop from "antd-img-crop";
import { toast } from "react-toastify";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";

function doDownload(url: string, fileName: string) {
    const a = document.createElement('a');
    a.download = fileName;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export default function QrGenerator() {
    const [color, setColor] = useState("#00C951");
    const [text, setText] = useState("https://devtools.vezinbastien.com");
    const [icon, setIcon] = useState<string | undefined>(undefined);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [renderType, setRenderType] = useState<QRCodeProps['type']>('canvas');
    const [displayFormat, setDisplayFormat] = useState<'PNG' | 'SVG'>('PNG');

    const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const onPreview = async (file: UploadFile) => {
        const src = icon || file.thumbUrl || file.url;
        if (src) {
            const image = new Image();
            image.src = src;
            const imgWindow = window.open(src);
            imgWindow?.document.write(image.outerHTML);
        }
    };

    const beforeUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            setIcon(base64);

            setFileList([{
                uid: '-1',
                name: file.name,
                status: 'done',
                url: base64,
                thumbUrl: base64,
            }]);
        };
        reader.readAsDataURL(file);

        return false;
    };

    const downloadCanvasQRCode = () => {
        const canvas = document.getElementById('qrcode-container')?.querySelector<HTMLCanvasElement>('canvas');
        if (canvas) {
            const url = canvas.toDataURL();
            doDownload(url, 'QRCode.png');
            toast.success("QR Code téléchargé !");
        }
    };

    const downloadSvgQRCode = () => {
        const svg = document.getElementById('qrcode-container')?.querySelector<SVGElement>('svg');
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            doDownload(url, 'QRCode.svg');
            toast.success("QR Code téléchargé !");
        }
    };

    const handleFormatChange = (value: string | number) => {
        const format = value as 'PNG' | 'SVG';
        setDisplayFormat(format);
        setRenderType(format === 'PNG' ? 'canvas' : 'svg');
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-[#111] border border-[#1b1b1b] rounded-2xl shadow-xl space-y-6">
            <h2 className="text-xl font-semibold text-white">Générateur de QR Code</h2>

            {/* QR Code */}
            <div className="flex flex-col items-center space-y-4 p-4 bg-[#1a1a1a] rounded-xl border border-[#222]">
                <Segmented
                    options={['PNG', 'SVG']}
                    value={displayFormat}
                    onChange={handleFormatChange}
                    className="qr-segmented"
                />
                <div id="qrcode-container">
                    <QRCode
                        value={text}
                        color={color}
                        icon={icon}
                        size={200}
                        type={renderType}
                    />
                </div>
                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={renderType === 'canvas' ? downloadCanvasQRCode : downloadSvgQRCode}
                    className="w-full"
                    style={{
                        background: '#00C951',
                        borderColor: '#00C951',
                        height: '40px',
                        fontWeight: '500'
                    }}
                >
                    Télécharger le QR Code
                </Button>
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
                <ImgCrop
                    rotationSlider
                    aspect={1}
                    quality={1}
                    modalTitle="Recadrer l'image"
                    modalOk="Valider"
                    modalCancel="Annuler"
                    beforeCrop={(file: { type: string; }) => {
                        const isImage = file.type.startsWith('image/');
                        if (!isImage) {
                            toast.error('Vous devez uploader une image !');
                        }
                        return isImage;
                    }}
                >
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={onChange}
                        onPreview={onPreview}
                        beforeUpload={beforeUpload}
                        maxCount={1}
                        accept="image/*"
                        className="qr-icon-upload"
                        onRemove={() => {
                            setIcon(undefined);
                            setFileList([]);
                        }}
                    >
                        {fileList.length < 1 && (
                            <div className="text-white">
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        )}
                    </Upload>
                </ImgCrop>
            </div>

            {/* Couleur du QR */}
            <div className="flex items-center gap-4">
                <label className="text-white">Couleur</label>
                <ColorPicker
                    value={color}
                    onChange={(c) => setColor(c.toHexString())}
                    disabledAlpha
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
