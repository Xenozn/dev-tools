import { useState } from "react";
import { QRCode, Upload, Button, Segmented, ColorPicker, Input, Tabs } from "antd";
import type { UploadFile, UploadProps, QRCodeProps } from "antd";
import ImgCrop from "antd-img-crop";
import { toast } from "react-toastify";
import { PlusOutlined, DownloadOutlined, LinkOutlined, IdcardOutlined } from "@ant-design/icons";

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
    const [qrType, setQrType] = useState<'url' | 'vcard'>('url');

    // États pour URL
    const [urlText, setUrlText] = useState("https://devtools.vezinbastien.com");

    // États pour vCard
    const [vCardData, setVCardData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        fax: "",
        mobile: "",
        email: "",
        organization: "",
        position: "",
        street: "",
        city: "",
        postalCode: "",
        region: "",
        country: "",
        website: "",
    });

    const [icon, setIcon] = useState<string | undefined>(undefined);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [renderType, setRenderType] = useState<QRCodeProps['type']>('canvas');
    const [displayFormat, setDisplayFormat] = useState<'PNG' | 'SVG'>('PNG');

    // Générer le contenu du QR Code selon le type
    const getQRContent = () => {
        if (qrType === 'url') {
            return urlText;
        } else {
            // Format vCard
            return `BEGIN:VCARD
VERSION:3.0
FN:${vCardData.firstName} ${vCardData.lastName}
N:${vCardData.lastName};${vCardData.firstName};;;
TEL;TYPE=CELL:${vCardData.phone}
TEL;TYPE=FAX:${vCardData.fax}
TEL;TYPE=WORK:${vCardData.mobile}
EMAIL:${vCardData.email}
ORG:${vCardData.organization}
TITLE:${vCardData.position}
ADR;TYPE=WORK:;;${vCardData.street};${vCardData.city};${vCardData.region};${vCardData.postalCode};${vCardData.country}
URL:${vCardData.website}
END:VCARD`;
        }
    };

    const handleVCardChange = (field: string, value: string) => {
        setVCardData({ ...vCardData, [field]: value });
    };

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

    const tabItems = [
        {
            key: 'url',
            label: (
                <span className="flex items-center gap-2">
                    <LinkOutlined />
                    URL
                </span>
            ),
            children: (
                <div className="flex flex-col space-y-2">
                    <label className="text-white">Texte / URL</label>
                    <input
                        type="text"
                        placeholder="Entrez votre texte ou URL"
                        maxLength={120}
                        value={urlText}
                        onChange={(e) => setUrlText(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#131313] border border-[#2a2a2a] text-white focus:outline-none focus:ring-2 focus:ring-[#00C951]"
                    />
                </div>
            ),
        },
        {
            key: 'vcard',
            label: (
                <span className="flex items-center gap-2">
                    <IdcardOutlined />
                    vCard
                </span>
            ),
            children: (
                <div className="space-y-4">
                    {/* Nom */}
                    <div className="space-y-2">
                        <label className="text-white">Nom complet</label>
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                placeholder="Prénom"
                                value={vCardData.firstName}
                                onChange={(e) => handleVCardChange("firstName", e.target.value)}
                                className="custom-input"
                            />
                            <Input
                                placeholder="Nom"
                                value={vCardData.lastName}
                                onChange={(e) => handleVCardChange("lastName", e.target.value)}
                                className="custom-input"
                            />
                        </div>
                    </div>

                    {/* Numéros */}
                    <div className="space-y-2">
                        <label className="text-white">Téléphone</label>
                        <Input
                            placeholder="Téléphone principal"
                            value={vCardData.phone}
                            onChange={(e) => handleVCardChange("phone", e.target.value)}
                            className="custom-input"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            placeholder="Mobile"
                            value={vCardData.mobile}
                            onChange={(e) => handleVCardChange("mobile", e.target.value)}
                            className="custom-input"
                        />
                        <Input
                            placeholder="Fax"
                            value={vCardData.fax}
                            onChange={(e) => handleVCardChange("fax", e.target.value)}
                            className="custom-input"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-white">Email</label>
                        <Input
                            type="email"
                            placeholder="email@example.com"
                            value={vCardData.email}
                            onChange={(e) => handleVCardChange("email", e.target.value)}
                            className="custom-input"
                        />
                    </div>

                    {/* Organisation */}
                    <div className="space-y-2">
                        <label className="text-white">Société / Profession</label>
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                placeholder="Société/organisme"
                                value={vCardData.organization}
                                onChange={(e) => handleVCardChange("organization", e.target.value)}
                                className="custom-input"
                            />
                            <Input
                                placeholder="Poste"
                                value={vCardData.position}
                                onChange={(e) => handleVCardChange("position", e.target.value)}
                                className="custom-input"
                            />
                        </div>
                    </div>

                    {/* Adresse */}
                    <div className="space-y-2">
                        <label className="text-white">Adresse</label>
                        <Input
                            placeholder="Rue"
                            value={vCardData.street}
                            onChange={(e) => handleVCardChange("street", e.target.value)}
                            className="custom-input"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            placeholder="Ville"
                            value={vCardData.city}
                            onChange={(e) => handleVCardChange("city", e.target.value)}
                            className="custom-input"
                        />
                        <Input
                            placeholder="Code postal"
                            value={vCardData.postalCode}
                            onChange={(e) => handleVCardChange("postalCode", e.target.value)}
                            className="custom-input"
                        />
                    </div>

                    <Input
                        placeholder="Région"
                        value={vCardData.region}
                        onChange={(e) => handleVCardChange("region", e.target.value)}
                        className="custom-input"
                    />

                    <Input
                        placeholder="Pays"
                        value={vCardData.country}
                        onChange={(e) => handleVCardChange("country", e.target.value)}
                        className="custom-input"
                    />

                    {/* Site web */}
                    <div className="space-y-2">
                        <label className="text-white">Site Internet</label>
                        <Input
                            placeholder="www.exemple.fr"
                            value={vCardData.website}
                            onChange={(e) => handleVCardChange("website", e.target.value)}
                            className="custom-input"
                        />
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="max-w-2xl mx-auto p-6 bg-[#111] border border-[#1b1b1b] rounded-2xl shadow-xl space-y-6">
            <h2 className="text-xl font-semibold text-white">Générateur de QR Code</h2>

            {/* QR Code Display */}
            <div className="flex flex-col items-center space-y-4 p-4 bg-[#1a1a1a] rounded-xl border border-[#222]">
                <Segmented
                    options={['PNG', 'SVG']}
                    value={displayFormat}
                    onChange={handleFormatChange}
                    className="qr-segmented"
                />
                <div id="qrcode-container">
                    <QRCode
                        value={getQRContent()}
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

            {/* Type de QR Code - Tabs */}
            <Tabs
                items={tabItems}
                onChange={(key) => setQrType(key as 'url' | 'vcard')}
                className="qr-tabs"
            />

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
