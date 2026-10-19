import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { fabric } from 'fabric';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import {
    Palette, Edit2, CheckCircle2, ImagePlus, Type, Trash2,
    AlignLeft, AlignCenter, AlignRight, Crosshair,
    GripVertical, Loader2, Bold, Italic, Underline,
    X, AlertCircle, Sparkles, ChevronRight
} from 'lucide-react';
import { useDesignStore } from '../../features/design-studio/store/designStore';
import RealisticShirt3D from '../../features/design-studio/components/RealisticShirt3D';

const FONT_FAMILIES = [
    { value: 'Inter, sans-serif', label: 'Mặc định (Inter)' },
    { value: 'Arial, sans-serif', label: 'Arial (Hiện đại)' },
    { value: 'Impact, sans-serif', label: 'Impact (Thể thao / Đậm)' },
    { value: 'Georgia, serif', label: 'Georgia (Cổ điển)' },
    { value: '"Times New Roman", serif', label: 'Times New Roman' },
    { value: '"Courier New", monospace', label: 'Courier New (Máy chữ)' },
    { value: '"Comic Sans MS", cursive', label: 'Comic Sans (Vui nhộn)' },
    { value: '"Trebuchet MS", sans-serif', label: 'Trebuchet MS' },
];

const PRESET_TEXT_COLORS = [
    '#18181b', '#ffffff', '#f0592a', '#ef4444',
    '#eab308', '#22c55e', '#3b82f6', '#a855f7'
];

function CanvasLoader() {
    return (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-zinc-200 flex items-center justify-center mb-2 text-[#f0592a] animate-spin">
                <Loader2 className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-bold text-zinc-500">Đang nạp 3D...</p>
        </div>
    );
}

export default function DesignStudio() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [editingDesignId, setEditingDesignId] = useState(
        location.state?.editDesign?.designId || searchParams.get('designId') || null
    );
    const fileInputRef = useRef(null);
    const orbitControlsRef = useRef();

    // 2 Canvas độc lập hoàn toàn cho Mặt Trước và Mặt Sau
    const frontCanvasElRef = useRef(null);
    const backCanvasElRef = useRef(null);
    const frontFabricRef = useRef(null);
    const backFabricRef = useRef(null);

    const {
        designTitle, setDesignTitle, garmentColor, setGarmentColor,
        viewSide, setViewSide, showGrid,
        setFrontTextureUrl, setBackTextureUrl,
        resetDesign
    } = useDesignStore();

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [layers, setLayers] = useState([]);
    const [selectedObjectProps, setSelectedObjectProps] = useState(null);
    const [rotationAngle, setRotationAngle] = useState(0);
    const [cameraAngle, setCameraAngle] = useState('front');
    const [isSaving, setIsSaving] = useState(false);
    const [saveDialog, setSaveDialog] = useState({
        isOpen: false,
        type: 'success', // 'success' | 'error'
        title: '',
        message: '',
        designId: null,
        versionId: null,
        previewUrl: null,
    });

    const CANVAS_WIDTH = 150;
    const CANVAS_HEIGHT = 200;

    // Lấy đúng thực thể Fabric Canvas của mặt đang chọn
    const getActiveCanvas = (side = viewSide) => {
        return side === 'back' ? backFabricRef.current : frontFabricRef.current;
    };

    // Xuất ảnh PNG Base64 từ đúng Canvas của mặt đó sang 3D Store
    const exportSideTexture = (side) => {
        const canvas = side === 'back' ? backFabricRef.current : frontFabricRef.current;
        if (!canvas || !canvas.lowerCanvasEl) return;

        const objects = canvas.getObjects();
        if (objects.length === 0) {
            if (side === 'back') setBackTextureUrl(null);
            else setFrontTextureUrl(null);
            return;
        }

        // Bỏ khung viền cam tạm thời khi chụp ảnh sang 3D để áo 3D không bị dính khung chọn
        const activeObj = canvas.getActiveObject();
        if (activeObj) {
            activeObj.hasBorders = false;
            activeObj.hasControls = false;
            canvas.renderAll();
        }

        const dataUrl = canvas.toDataURL({ format: 'png', multiplier: 2 });

        if (activeObj) {
            activeObj.hasBorders = true;
            activeObj.hasControls = true;
            canvas.renderAll();
        }

        if (side === 'back') setBackTextureUrl(dataUrl);
        else setFrontTextureUrl(dataUrl);
    };

    // Đồng bộ danh sách Layer ở cột bên phải
    const syncLayersList = (canvas) => {
        if (!canvas) {
            setLayers([]);
            return;
        }
        setLayers(
            canvas.getObjects().map((obj, idx) => ({
                id: obj.id || idx,
                fabricObj: obj,
                name: obj.type === 'textbox'
                    ? (obj.text ? `Chữ: "${obj.text.substring(0, 14)}"` : `Văn bản #${idx + 1}`)
                    : (obj.name || `Hình ảnh #${idx + 1}`),
                type: obj.type,
                visible: obj.visible !== false,
                locked: !!obj.lockMovementX,
            })).reverse()
        );
    };

    // Đọc toàn bộ thuộc tính của đối tượng đang chọn (bao gồm Font, Size, Màu chữ)
    const extractObjectProps = (active) => {
        if (!active) return null;
        return {
            id: active.id,
            name: active.name || (active.type === 'textbox' ? 'Văn bản' : 'Hình ảnh'),
            type: active.type,
            posX: Math.round(active.left || 0),
            posY: Math.round(active.top || 0),
            widthCm: Number((active.getScaledWidth() / 10).toFixed(1)),
            heightCm: Number((active.getScaledHeight() / 10).toFixed(1)),
            rotation: Math.round((active.angle || 0) % 360),
            locked: !!active.lockMovementX,
            // Thuộc tính dành riêng cho Textbox
            text: active.text || '',
            fontSize: Math.round(active.fontSize || 16),
            fontFamily: active.fontFamily || 'Inter, sans-serif',
            fill: typeof active.fill === 'string' ? active.fill : '#18181b',
            fontWeight: active.fontWeight || 'normal',
            fontStyle: active.fontStyle || 'normal',
            underline: !!active.underline,
            textAlign: active.textAlign || 'center',
        };
    };

    // Khởi tạo cả 2 Canvas (Trước & Sau) khi mở trang
    useEffect(() => {
        resetDesign();

        fabric.Object.prototype.set({
            borderColor: '#f0592a',
            cornerColor: '#ffffff',
            cornerStrokeColor: '#f0592a',
            cornerSize: 8,
            transparentCorners: false,
            cornerStyle: 'rect',
            padding: 4,
        });

        const initSingleCanvas = (el, sideName) => {
            if (!el) return null;
            const c = new fabric.Canvas(el, {
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                preserveObjectStacking: true,
                selection: true,
                backgroundColor: 'transparent',
            });

            const updateProps = () => {
                const active = c.getActiveObject();
                setSelectedObjectProps(extractObjectProps(active));
                syncLayersList(c);
            };

            c.on('selection:created', updateProps);
            c.on('selection:updated', updateProps);
            c.on('selection:cleared', () => setSelectedObjectProps(null));

            c.on('object:modified', () => { updateProps(); exportSideTexture(sideName); });
            c.on('object:moving', () => exportSideTexture(sideName));
            c.on('object:scaling', () => { updateProps(); exportSideTexture(sideName); });
            c.on('object:rotating', () => { updateProps(); exportSideTexture(sideName); });
            c.on('text:changed', () => { updateProps(); exportSideTexture(sideName); });

            c.on('object:added', () => { syncLayersList(c); exportSideTexture(sideName); });
            c.on('object:removed', () => { syncLayersList(c); exportSideTexture(sideName); });

            return c;
        };

        const frontC = initSingleCanvas(frontCanvasElRef.current, 'front');
        const backC = initSingleCanvas(backCanvasElRef.current, 'back');

        frontFabricRef.current = frontC;
        backFabricRef.current = backC;

        return () => {
            if (frontC) frontC.dispose();
            if (backC) backC.dispose();
            frontFabricRef.current = null;
            backFabricRef.current = null;
        };
    }, []);

    // Hàm nạp dữ liệu của mẫu thiết kế được chọn để Chỉnh sửa lên 2 Canvas Trước & Sau
    const populateDesignOntoCanvases = (designData) => {
        if (!designData) return;

        setEditingDesignId(designData.designId);
        setDesignTitle(designData.name || 'Mẫu áo chưa đặt tên');
        setGarmentColor(designData.garmentColor || '#F5F2DC');

        const frontC = frontFabricRef.current;
        const backC = backFabricRef.current;
        if (!frontC || !backC) return;

        frontC.clear();
        backC.clear();
        frontC.backgroundColor = 'transparent';
        backC.backgroundColor = 'transparent';

        const elements = designData.elements || [];
        let pendingImages = 0;

        const finalizeLoad = () => {
            frontC.renderAll();
            backC.renderAll();
            exportSideTexture('front');
            exportSideTexture('back');
            syncLayersList(getActiveCanvas('front'));
        };

        elements.forEach((el, idx) => {
            const targetCanvas = el.side === 'back' ? backC : frontC;

            if (el.elementType === 'text') {
                const textObj = new fabric.Textbox(el.textContent || 'Văn bản', {
                    id: `txt-loaded-${idx}-${Date.now()}`,
                    name: 'Văn bản',
                    left: el.positionX ?? 15,
                    top: el.positionY ?? 40,
                    width: el.width ?? 120,
                    fontSize: el.fontSize ?? 18,
                    fontFamily: el.fontFamily || 'Inter, sans-serif',
                    fontWeight: el.fontWeight || 'bold',
                    fill: el.color || '#18181b',
                    angle: el.rotation ?? 0,
                    textAlign: 'center',
                });
                targetCanvas.add(textObj);
            } else if (el.elementType === 'image' && (el.imageUrl || el.textContent)) {
                const imgSrc = el.imageUrl || el.textContent;
                pendingImages++;
                fabric.Image.fromURL(
                    imgSrc,
                    (img) => {
                        if (img) {
                            img.set({
                                id: `img-loaded-${idx}-${Date.now()}`,
                                name: `Hình ảnh #${idx + 1}`,
                                left: el.positionX ?? 25,
                                top: el.positionY ?? 50,
                                angle: el.rotation ?? 0,
                            });
                            if (el.width) img.scaleToWidth(el.width);
                            targetCanvas.add(img);
                        }
                        pendingImages--;
                        if (pendingImages === 0) finalizeLoad();
                    },
                    { crossOrigin: 'anonymous' }
                );
            }
        });

        if (pendingImages === 0) {
            finalizeLoad();
        }
    };

    // Tự động kiểm tra và load thiết kế cần chỉnh sửa khi vào trang
    useEffect(() => {
        const editDesignState = location.state?.editDesign;
        const queryDesignId = searchParams.get('designId');

        if (editDesignState) {
            populateDesignOntoCanvases(editDesignState);
        } else if (queryDesignId) {
            fetch(`/api/v1/designs/${queryDesignId}`)
                .then((res) => (res.ok ? res.json() : null))
                .then((data) => {
                    if (data) populateDesignOntoCanvases(data);
                })
                .catch((err) => console.error('Không thể tải thiết kế để chỉnh sửa:', err));
        }
    }, [location.state, searchParams]);

    // Chuyển đổi Mặt trước <-> Mặt sau tức thì
    const handleSwitchSide = (newSide) => {
        if (newSide === viewSide) return;

        const oldCanvas = getActiveCanvas(viewSide);
        if (oldCanvas) {
            oldCanvas.discardActiveObject();
            oldCanvas.renderAll();
            exportSideTexture(viewSide);
        }

        setViewSide(newSide);
        setSelectedObjectProps(null);
        setCameraAngle(newSide);
        setRotationAngle(newSide === 'front' ? 0 : 180);

        if (orbitControlsRef.current) {
            orbitControlsRef.current.reset();
        }

        const newCanvas = getActiveCanvas(newSide);
        if (newCanvas) {
            newCanvas.discardActiveObject();
            newCanvas.renderAll();
            syncLayersList(newCanvas);
            exportSideTexture(newSide);
        }
    };

    const handleAddText = () => {
        const canvas = getActiveCanvas();
        if (!canvas) return;

        const text = new fabric.Textbox('Nội dung chữ mới', {
            id: 'txt-' + Date.now(),
            name: 'Văn bản',
            left: 15,
            top: 40,
            width: 120,
            fontSize: 18,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 'bold',
            fontStyle: 'normal',
            underline: false,
            fill: '#18181b',
            textAlign: 'center',
        });

        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
        setSelectedObjectProps(extractObjectProps(text));
        syncLayersList(canvas);
        exportSideTexture(viewSide);
    };

    const handleUploadImage = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const targetSide = viewSide;
        const targetCanvas = getActiveCanvas(targetSide);

        const reader = new FileReader();
        reader.onload = (f) => {
            fabric.Image.fromURL(f.target?.result, (img) => {
                if (!targetCanvas) return;
                if (img.width > 100 || img.height > 100) img.scaleToWidth(100);
                img.set({
                    id: 'img-' + Date.now(),
                    name: file.name.substring(0, 15),
                    left: 25,
                    top: 50
                });

                targetCanvas.add(img);
                targetCanvas.setActiveObject(img);
                targetCanvas.renderAll();
                setSelectedObjectProps(extractObjectProps(img));
                syncLayersList(targetCanvas);
                exportSideTexture(targetSide);
            });
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const alignActiveObject = (mode) => {
        const canvas = getActiveCanvas();
        const active = canvas?.getActiveObject();
        if (!canvas || !active) return;

        if (mode === 'left') active.set({ left: 10 });
        if (mode === 'center-h') active.viewportCenterH();
        if (mode === 'right') active.set({ left: CANVAS_WIDTH - active.getScaledWidth() - 10 });
        if (mode === 'center-all') active.viewportCenter();

        active.setCoords();
        canvas.renderAll();
        setSelectedObjectProps(extractObjectProps(active));
        exportSideTexture(viewSide);
    };

    // Cập nhật thuộc tính chung & thuộc tính Chữ (Size, Font, Màu, Đậm/Nghiêng/Gạch chân)
    const handlePropChange = (key, val) => {
        const canvas = getActiveCanvas();
        const active = canvas?.getActiveObject();
        if (!canvas || !active) return;

        if (key === 'posX') active.set({ left: Number(val) });
        if (key === 'posY') active.set({ top: Number(val) });
        if (key === 'rotation') active.set({ angle: Number(val) });
        if (key === 'widthCm') active.scaleToWidth(Number(val) * 10);
        if (key === 'heightCm') active.scaleToHeight(Number(val) * 10);

        // Các thuộc tính dành riêng cho Văn bản (Textbox)
        if (active.type === 'textbox') {
            if (key === 'text') active.set({ text: val });
            if (key === 'fontSize') active.set({ fontSize: Math.max(8, Math.min(80, Number(val) || 8)) });
            if (key === 'fontFamily') active.set({ fontFamily: val });
            if (key === 'fill') active.set({ fill: val });
            if (key === 'fontWeight') active.set({ fontWeight: val });
            if (key === 'fontStyle') active.set({ fontStyle: val });
            if (key === 'underline') active.set({ underline: Boolean(val) });
            if (key === 'textAlign') active.set({ textAlign: val });
        }

        active.setCoords();
        canvas.renderAll();
        setSelectedObjectProps(extractObjectProps(active));
        syncLayersList(canvas);
        exportSideTexture(viewSide);
    };

    const handleDeleteActive = () => {
        const canvas = getActiveCanvas();
        const active = canvas?.getActiveObject();
        if (!canvas || !active) return;

        canvas.remove(active);
        canvas.discardActiveObject();
        canvas.renderAll();
        setSelectedObjectProps(null);
        syncLayersList(canvas);
        exportSideTexture(viewSide);
    };

    const handleCameraChange = (angle) => {
        setCameraAngle(angle);
        setRotationAngle(angle === 'front' ? 0 : angle === 'angled' ? 45 : angle === 'side' ? 90 : 180);
        if (orbitControlsRef.current) orbitControlsRef.current.reset();
    };

    // Hàm ghép Mặt Trước (Trái) và Mặt Sau (Phải) kèm phôi áo thành 1 ảnh duy nhất
    const generateCombinedPreviewImage = async () => {
        const frontC = frontFabricRef.current;
        const backC = backFabricRef.current;

        // Bỏ chọn các khung viền cam trên cả 2 canvas trước khi chụp
        if (frontC) {
            frontC.discardActiveObject();
            frontC.renderAll();
        }
        if (backC) {
            backC.discardActiveObject();
            backC.renderAll();
        }

        // Tạo Canvas ẩn kích thước 800x440 (Trái: 400x440, Phải: 400x440)
        const compositeCanvas = document.createElement('canvas');
        compositeCanvas.width = 800;
        compositeCanvas.height = 440;
        const ctx = compositeCanvas.getContext('2d');

        // 1. Tô nền trắng sạch sẽ và vẽ khung viền + đường chia đôi ở giữa
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 800, 440);

        ctx.strokeStyle = '#e4e4e7';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, 798, 438);

        // Đường kẻ dọc chia đôi Mặt trước (Trái) và Mặt sau (Phải)
        ctx.beginPath();
        ctx.moveTo(400, 0);
        ctx.lineTo(400, 440);
        ctx.stroke();

        // Hàm tiện ích nạp chuỗi SVG/DataURL thành đối tượng Image
        const loadImg = (src) =>
            new Promise((resolve) => {
                if (!src) return resolve(null);
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => resolve(img);
                img.onerror = () => resolve(null);
                img.src = src;
            });

        // 2. Tạo ảnh phôi áo SVG với đúng màu áo hiện tại
        const svgString = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="360" height="360">
                <path d="M 180 40 L 110 60 L 40 140 L 105 215 L 140 180 L 140 420 L 360 420 L 360 180 L 395 215 L 460 140 L 390 60 L 320 40 Q 250 70 180 40 Z"
                      fill="${garmentColor || '#F5F2DC'}" stroke="#27272a" stroke-width="3" stroke-linejoin="round" />
                <path d="M 170 40 Q 250 80 330 40 Q 250 50 170 40 Z" fill="rgba(0,0,0,0.06)" />
            </svg>
        `;
        const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
        const shirtBgImg = await loadImg(svgDataUrl);

        // Vẽ phôi áo vào nửa bên trái (Mặt trước) và nửa bên phải (Mặt sau)
        if (shirtBgImg) {
            ctx.drawImage(shirtBgImg, 20, 45, 360, 360);
            ctx.drawImage(shirtBgImg, 420, 45, 360, 360);
        }

        // 3. Xuất hình thiết kế trên Canvas Mặt Trước & Mặt Sau và dán đè lên đúng vị trí ngực/lưng áo
        const frontHasObjs = frontC && frontC.getObjects().length > 0;
        const backHasObjs = backC && backC.getObjects().length > 0;

        const frontDesignUrl = frontHasObjs ? frontC.toDataURL({ format: 'png', multiplier: 2 }) : null;
        const backDesignUrl = backHasObjs ? backC.toDataURL({ format: 'png', multiplier: 2 }) : null;

        const [frontDesignImg, backDesignImg] = await Promise.all([
            loadImg(frontDesignUrl),
            loadImg(backDesignUrl),
        ]);

        // Tọa độ vùng in tương ứng với phôi áo 360x360: rộng 142px, cao 190px
        if (frontDesignImg) {
            ctx.drawImage(frontDesignImg, 129, 135, 142, 190);
        }
        if (backDesignImg) {
            ctx.drawImage(backDesignImg, 529, 135, 142, 190);
        }

        // 4. Vẽ nhãn tiêu đề "MẶT TRƯỚC" và "MẶT SAU" ở góc trên mỗi nửa
        ctx.fillStyle = '#18181b';
        ctx.font = 'bold 13px Inter, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('MẶT TRƯỚC', 200, 28);
        ctx.fillText('MẶT SAU', 600, 28);

        return compositeCanvas.toDataURL('image/png', 0.95);
    };

    const handleSaveDesign = async () => {
        const frontC = frontFabricRef.current;
        const backC = backFabricRef.current;
        if (!frontC && !backC) return;

        // Thu thập tất cả các phần tử của cả Mặt trước VÀ Mặt sau để lưu vào DB
        const collectElements = (c, sideLabel) => {
            if (!c) return [];
            return c.getObjects().map(obj => ({
                side: sideLabel,
                elementType: obj.type === 'textbox' ? 'text' : 'image',
                textContent: obj.type === 'textbox' ? obj.text : null,
                imageUrl: obj.type !== 'textbox' && typeof obj.getSrc === 'function' ? obj.getSrc() : null,
                positionX: obj.left,
                positionY: obj.top,
                width: obj.getScaledWidth(),
                height: obj.getScaledHeight(),
                rotation: obj.angle,
                color: obj.fill || '#000000',
                fontSize: obj.fontSize || null,
                fontFamily: obj.fontFamily || null,
                fontWeight: obj.fontWeight || 'normal'
            }));
        };

        const allElements = [
            ...collectElements(frontC, 'front'),
            ...collectElements(backC, 'back')
        ];

        // Tạo ảnh ghép Mặt Trước (Trái) + Mặt Sau (Phải) để tải lên Cloudinary
        const previewDataUrl = await generateCombinedPreviewImage();

        const payload = {
            designId: editingDesignId ? Number(editingDesignId) : null, // Gửi designId để tăng version_number
            name: designTitle || "Mẫu áo chưa đặt tên",
            garmentId: 1,
            garmentColor: garmentColor,
            previewImageUrl: previewDataUrl,
            elements: allElements
        };

        setIsSaving(true);
        try {
            const response = await fetch('/api/v1/designs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                setEditingDesignId(data.designId); // Giữ lại designId cho các lần bấm Lưu tiếp theo
                setSaveDialog({
                    isOpen: true,
                    type: 'success',
                    title: 'Lưu mẫu thiết kế thành công!',
                    message: 'Bản thiết kế của bạn đã được lưu vào "Thiết kế của tôi"',
                    designId: data.designId,
                    versionId: data.versionNumber || data.versionId, // Hiển thị đúng số version_number đã tăng
                    previewUrl: previewDataUrl,
                });
            } else {
                setSaveDialog({
                    isOpen: true,
                    type: 'error',
                    title: 'Lưu thiết kế thất bại',
                    message: 'Vui lòng kiểm tra lại kết nối.',
                });
            }
        } catch (error) {
            console.error('Lỗi khi lưu thiết kế:', error);
            setSaveDialog({
                isOpen: true,
                type: 'error',
                title: 'Không thể kết nối máy chủ',
                message: 'Hệ thống không thể kết nối đến máy chủ Backend. Vui lòng thử lại sau.',
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full bg-[#fefccf] min-h-screen py-5 px-3 sm:px-6 xl:px-10 space-y-4">
            <input type="file" ref={fileInputRef} onChange={handleUploadImage} accept="image/png, image/jpeg, image/svg+xml" className="hidden" />

            {/* THANH TIÊU ĐỀ TRÊN CÙNG */}
            <div className="w-full bg-white rounded-2xl shadow-xs border border-zinc-200/70 p-3.5 sm:p-4 flex flex-col xl:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full xl:w-auto">
                    <div className="w-10 h-10 rounded-xl bg-[#fefccf] text-[#f0592a] border border-[#f0592a]/20 flex items-center justify-center shrink-0">
                        <Palette className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                        {isEditingTitle ? (
                            <input type="text" value={designTitle} onChange={(e) => setDesignTitle(e.target.value)} onBlur={() => setIsEditingTitle(false)} autoFocus className="font-bold text-sm sm:text-base text-zinc-950 bg-zinc-50 border border-zinc-300 rounded-lg px-2 py-0.5 outline-none" />
                        ) : (
                            <span className="font-bold text-sm sm:text-base text-zinc-950 truncate max-w-[280px] sm:max-w-md">{designTitle}</span>
                        )}
                        <button type="button" onClick={() => setIsEditingTitle(!isEditingTitle)} className="text-zinc-400 hover:text-[#f0592a] transition-colors cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 bg-zinc-100 p-1.5 rounded-xl border border-zinc-200/60">
                    <div className="inline-flex gap-1">
                        <button type="button" onClick={() => handleSwitchSide('front')} className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${viewSide === 'front' ? 'bg-white text-zinc-950 shadow-2xs border border-zinc-200/80 font-bold' : 'text-zinc-600 hover:text-zinc-950'}`}>
                            Mặt trước
                        </button>
                        <button type="button" onClick={() => handleSwitchSide('back')} className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${viewSide === 'back' ? 'bg-white text-zinc-950 shadow-2xs border border-zinc-200/80 font-bold' : 'text-zinc-600 hover:text-zinc-950'}`}>
                            Mặt sau
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 w-full xl:w-auto">
                    <button
                        type="button"
                        onClick={handleSaveDesign}
                        className="px-4 py-2 bg-[#f0592a] hover:bg-[#d94a1f] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Lưu thiết kế</span>
                    </button>
                </div>
            </div>

            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

                {/* 1. CỘT CÔNG CỤ TRÁI */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-xs border border-zinc-200/70 p-3 flex lg:flex-col items-center justify-between lg:justify-start gap-4">
                    <div className="flex lg:flex-col items-center gap-2 w-full">
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="w-12 h-12 rounded-xl bg-[#faf8e4] text-[#f0592a] hover:bg-[#f0592a] hover:text-white transition-all flex flex-col items-center justify-center border border-[#f0592a]/20 cursor-pointer">
                            <ImagePlus className="w-5 h-5" /><span className="text-[9px] font-bold mt-0.5">Ảnh</span>
                        </button>
                        <button type="button" onClick={handleAddText} className="w-12 h-12 rounded-xl bg-zinc-50 text-zinc-600 hover:text-[#f0592a] hover:bg-[#faf8e4] transition-all flex flex-col items-center justify-center border border-zinc-200/60 cursor-pointer">
                            <Type className="w-5 h-5" /><span className="text-[9px] font-semibold mt-0.5">Chữ</span>
                        </button>
                    </div>

                    <div className="w-full h-px bg-zinc-200 hidden lg:block my-1"></div>

                    <div className="flex flex-col items-center justify-center w-full gap-2" title="Đổi màu phôi áo">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Màu áo</span>
                        <div className="relative w-12 h-12 rounded-full flex items-center justify-center p-[3px] shadow-sm hover:scale-105 transition-transform" style={{ background: 'conic-gradient(from 0deg, red, yellow, lime, aqua, blue, magenta, red)' }}>
                            <div className="w-full h-full rounded-full border-[3px] border-white relative overflow-hidden shadow-inner" style={{ backgroundColor: garmentColor }}>
                                <input type="color" value={garmentColor || '#FFFFFF'} onChange={(e) => setGarmentColor(e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-zinc-200 hidden lg:block my-1"></div>

                    <div className="flex lg:flex-col items-center gap-2">
                        <button type="button" disabled={!selectedObjectProps} onClick={handleDeleteActive} title="Xóa đối tượng đang chọn" className="w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                </div>

                {/* 2. CỘT BIÊN TẬP 2D */}
                <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-zinc-200/70 p-4 relative min-h-[580px] flex items-center justify-center overflow-hidden">
                    <div className="absolute top-4 left-4 right-4 flex justify-between z-20 pointer-events-none">
                        <span className="font-bold text-zinc-900 text-[10px] uppercase bg-white/90 px-3 py-1.5 rounded-xl shadow-2xs border">
                            BIÊN TẬP 2D • {viewSide === 'front' ? 'MẶT TRƯỚC' : 'MẶT SAU'}
                        </span>
                    </div>

                    <div className="relative w-full h-full flex flex-col items-center justify-center mt-4">

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                            <svg viewBox="0 0 500 500" className="w-[380px] h-[380px] transition-colors duration-300 drop-shadow-md">
                                <path
                                    d="M 180 40 L 110 60 L 40 140 L 105 215 L 140 180 L 140 420 L 360 420 L 360 180 L 395 215 L 460 140 L 390 60 L 320 40 Q 250 70 180 40 Z"
                                    fill={garmentColor}
                                    stroke="#27272a"
                                    strokeWidth="3"
                                    strokeLinejoin="round"
                                />
                                <path d="M 170 40 Q 250 80 330 40 Q 250 50 170 40 Z" fill="rgba(0,0,0,0.05)" />
                            </svg>
                        </div>

                        {/* BỘ LỌC CẮT (CLIP) VÀ 2 CANVAS ĐỘC LẬP */}
                        <div className="relative z-10 w-[150px] h-[200px] mt-[10px] shadow-sm bg-white/5 rounded-sm">
                            {/* Canvas Mặt Trước */}
                            <div className={`absolute inset-0 w-full h-full overflow-hidden rounded-sm z-10 ${viewSide === 'front' ? 'block' : 'hidden'}`}>
                                <canvas ref={frontCanvasElRef} />
                            </div>

                            {/* Canvas Mặt Sau */}
                            <div className={`absolute inset-0 w-full h-full overflow-hidden rounded-sm z-10 ${viewSide === 'back' ? 'block' : 'hidden'}`}>
                                <canvas ref={backCanvasElRef} />
                            </div>

                            {/* Khung viền đứt nét đỏ */}
                            <div className="absolute inset-0 border-2 border-dashed border-red-500 rounded-sm pointer-events-none z-20"></div>

                            {showGrid && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 z-20">
                                    <div className="w-full h-px bg-red-500"></div>
                                    <div className="h-full w-px bg-red-500 absolute"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. CỘT TRỰC QUAN 3D */}
                <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-zinc-200/70 p-4 relative min-h-[580px] flex items-center justify-center overflow-hidden">
                    <div className="absolute top-4 left-4 right-4 flex justify-between z-10 pointer-events-none">
                        <span className="font-bold text-[#f0592a] text-[10px] uppercase bg-[#fefccf]/90 px-3 py-1.5 rounded-xl shadow-2xs border border-[#f0592a]/20">
                            TRỰC QUAN 3D
                        </span>
                    </div>

                    <div className="absolute inset-0 mt-12 mb-14 cursor-grab active:cursor-grabbing">
                        <Canvas shadows camera={{ position: [0, 0, 2.6], fov: 45 }} gl={{ preserveDrawingBuffer: true, antialias: true, toneMapping: 0 }}>
                            <ambientLight intensity={1.5} color="#ffffff" />
                            <directionalLight position={[0, 4, 3]} intensity={0.6} castShadow color="#ffffff" />
                            <directionalLight position={[-2, -2, -2]} intensity={0.4} color="#ffffff" />
                            <Environment preset="city" environmentIntensity={0.3} />

                            <Suspense fallback={<CanvasLoader />}>
                                <RealisticShirt3D rotationAngle={rotationAngle} />
                            </Suspense>
                            <OrbitControls ref={orbitControlsRef} enablePan={false} enableZoom={true} minDistance={1.8} maxDistance={4.0} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
                        </Canvas>
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border px-2 py-1.5 rounded-xl shadow-lg flex gap-1 z-10 text-[11px]">
                        {[{ id: 'front', label: 'Trước' }, { id: 'angled', label: 'Nghiêng' }, { id: 'side', label: 'Hông' }, { id: 'back', label: 'Sau' }].map(btn => (
                            <button key={btn.id} onClick={() => handleCameraChange(btn.id)} className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${cameraAngle === btn.id ? 'bg-[#f0592a] text-white' : 'text-zinc-600 hover:bg-zinc-100'}`}>
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. CỘT THUỘC TÍNH ĐỐI TƯỢNG */}
                <div className="lg:col-span-3 bg-white rounded-2xl shadow-xs p-4 sm:p-5 border border-zinc-200/70 flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                        <h3 className="text-sm font-bold text-zinc-950">Thuộc tính đối tượng</h3>
                        {selectedObjectProps && (
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#fefccf] text-[#f0592a] border border-[#f0592a]/20">
                                {selectedObjectProps.type === 'textbox' ? 'Văn bản' : 'Hình ảnh'}
                            </span>
                        )}
                    </div>

                    {selectedObjectProps ? (
                        <div className="space-y-4">
                            {/* Căn vị trí đối tượng trên khung in */}
                            <div className="space-y-1.5">
                                <span className="text-[11px] font-semibold text-zinc-500">Căn vị trí trên vùng in</span>
                                <div className="grid grid-cols-4 gap-1 bg-zinc-100 p-1 rounded-xl">
                                    <button type="button" title="Căn sát lề trái" onClick={() => alignActiveObject('left')} className="h-8 rounded-lg bg-white hover:bg-zinc-50 shadow-2xs flex justify-center items-center cursor-pointer"><AlignLeft className="w-4 h-4"/></button>
                                    <button type="button" title="Căn giữa theo chiều ngang" onClick={() => alignActiveObject('center-h')} className="h-8 rounded-lg bg-white hover:bg-zinc-50 shadow-2xs flex justify-center items-center cursor-pointer"><AlignCenter className="w-4 h-4"/></button>
                                    <button type="button" title="Căn sát lề phải" onClick={() => alignActiveObject('right')} className="h-8 rounded-lg bg-white hover:bg-zinc-50 shadow-2xs flex justify-center items-center cursor-pointer"><AlignRight className="w-4 h-4"/></button>
                                    <button type="button" title="Căn chính giữa tâm áo" onClick={() => alignActiveObject('center-all')} className="h-8 rounded-lg bg-white hover:bg-zinc-50 shadow-2xs flex justify-center items-center text-[#f0592a] cursor-pointer"><Crosshair className="w-4 h-4"/></button>
                                </div>
                            </div>

                            {/* BỘ CÔNG CỤ CHUYÊN BIỆT CHO ĐỐI TƯỢNG CHỮ (TEXTBOX) */}
                            {selectedObjectProps.type === 'textbox' && (
                                <div className="space-y-3.5 pt-2 border-t border-zinc-100">
                                    {/* 1. Nội dung văn bản */}
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-semibold text-zinc-500">Nội dung chữ</span>
                                        <input
                                            type="text"
                                            value={selectedObjectProps.text}
                                            onChange={(e) => handlePropChange('text', e.target.value)}
                                            placeholder="Nhập nội dung chữ..."
                                            className="w-full h-9 bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-[#f0592a] rounded-lg px-2.5 text-xs font-semibold text-zinc-900 outline-none transition-all"
                                        />
                                    </div>

                                    {/* 2. Chọn Phông chữ (Font Family) */}
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-semibold text-zinc-500">Phông chữ</span>
                                        <select
                                            value={selectedObjectProps.fontFamily}
                                            onChange={(e) => handlePropChange('fontFamily', e.target.value)}
                                            className="w-full h-9 bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-[#f0592a] rounded-lg px-2.5 text-xs font-semibold text-zinc-900 outline-none cursor-pointer transition-all"
                                        >
                                            {FONT_FAMILIES.map((font) => (
                                                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                                                    {font.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* 3. Cỡ chữ (Font Size) */}
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-[11px]">
                                            <span className="font-semibold text-zinc-500">Cỡ chữ (px)</span>
                                            <span className="font-bold text-[#f0592a]">{selectedObjectProps.fontSize}px</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <input
                                                type="range"
                                                min="8"
                                                max="60"
                                                step="1"
                                                value={selectedObjectProps.fontSize}
                                                onChange={(e) => handlePropChange('fontSize', e.target.value)}
                                                className="w-full accent-[#f0592a] cursor-pointer"
                                            />
                                            <input
                                                type="number"
                                                min="8"
                                                max="80"
                                                value={selectedObjectProps.fontSize}
                                                onChange={(e) => handlePropChange('fontSize', e.target.value)}
                                                className="w-14 h-8 bg-zinc-50 border border-zinc-200 rounded-lg px-2 text-xs font-bold text-center outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* 4. Kiểu chữ (Đậm, Nghiêng, Gạch chân) & Căn lề chữ */}
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-semibold text-zinc-500">Kiểu chữ & Căn dòng</span>
                                        <div className="grid grid-cols-6 gap-1 bg-zinc-100 p-1 rounded-xl">
                                            <button
                                                type="button"
                                                title="In đậm"
                                                onClick={() => handlePropChange('fontWeight', selectedObjectProps.fontWeight === 'bold' ? 'normal' : 'bold')}
                                                className={`h-8 rounded-lg flex justify-center items-center transition-all cursor-pointer ${selectedObjectProps.fontWeight === 'bold' ? 'bg-[#f0592a] text-white shadow-2xs' : 'bg-white text-zinc-700 hover:bg-zinc-50'}`}
                                            >
                                                <Bold className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                title="In nghiêng"
                                                onClick={() => handlePropChange('fontStyle', selectedObjectProps.fontStyle === 'italic' ? 'normal' : 'italic')}
                                                className={`h-8 rounded-lg flex justify-center items-center transition-all cursor-pointer ${selectedObjectProps.fontStyle === 'italic' ? 'bg-[#f0592a] text-white shadow-2xs' : 'bg-white text-zinc-700 hover:bg-zinc-50'}`}
                                            >
                                                <Italic className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                title="Gạch chân"
                                                onClick={() => handlePropChange('underline', !selectedObjectProps.underline)}
                                                className={`h-8 rounded-lg flex justify-center items-center transition-all cursor-pointer ${selectedObjectProps.underline ? 'bg-[#f0592a] text-white shadow-2xs' : 'bg-white text-zinc-700 hover:bg-zinc-50'}`}
                                            >
                                                <Underline className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                title="Căn chữ trái"
                                                onClick={() => handlePropChange('textAlign', 'left')}
                                                className={`h-8 rounded-lg flex justify-center items-center transition-all cursor-pointer ${selectedObjectProps.textAlign === 'left' ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-700 hover:bg-zinc-50'}`}
                                            >
                                                <AlignLeft className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                title="Căn chữ giữa"
                                                onClick={() => handlePropChange('textAlign', 'center')}
                                                className={`h-8 rounded-lg flex justify-center items-center transition-all cursor-pointer ${selectedObjectProps.textAlign === 'center' ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-700 hover:bg-zinc-50'}`}
                                            >
                                                <AlignCenter className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                title="Căn chữ phải"
                                                onClick={() => handlePropChange('textAlign', 'right')}
                                                className={`h-8 rounded-lg flex justify-center items-center transition-all cursor-pointer ${selectedObjectProps.textAlign === 'right' ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-700 hover:bg-zinc-50'}`}
                                            >
                                                <AlignRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* 5. Màu chữ (Text Color) */}
                                    <div className="space-y-1.5">
                                        <span className="text-[11px] font-semibold text-zinc-500">Màu chữ</span>
                                        <div className="flex items-center gap-2">
                                            <label className="relative w-9 h-9 rounded-lg border border-zinc-200 overflow-hidden cursor-pointer shrink-0 shadow-2xs" style={{ backgroundColor: selectedObjectProps.fill }}>
                                                <input
                                                    type="color"
                                                    value={selectedObjectProps.fill}
                                                    onChange={(e) => handlePropChange('fill', e.target.value)}
                                                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                                />
                                            </label>
                                            <input
                                                type="text"
                                                value={selectedObjectProps.fill}
                                                onChange={(e) => handlePropChange('fill', e.target.value)}
                                                className="w-24 h-9 bg-zinc-50 border border-zinc-200 rounded-lg px-2 text-xs font-bold uppercase text-zinc-800 outline-none"
                                            />
                                            <div className="flex flex-wrap gap-1 flex-1 justify-end">
                                                {PRESET_TEXT_COLORS.map((hex) => (
                                                    <button
                                                        key={hex}
                                                        type="button"
                                                        onClick={() => handlePropChange('fill', hex)}
                                                        className={`w-5 h-5 rounded-full border transition-transform hover:scale-110 cursor-pointer ${selectedObjectProps.fill.toLowerCase() === hex ? 'ring-2 ring-[#f0592a] border-white' : 'border-zinc-300'}`}
                                                        style={{ backgroundColor: hex }}
                                                        title={`Chọn màu ${hex}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* KÍCH THƯỚC & GÓC XOAY CHUNG */}
                            <div className="grid grid-cols-3 gap-2.5 text-xs pt-2 border-t border-zinc-100">
                                <div className="space-y-1">
                                    <span className="font-medium text-zinc-500 text-[11px]">Rộng (cm)</span>
                                    <input type="number" step="0.5" value={selectedObjectProps.widthCm} onChange={(e) => handlePropChange('widthCm', e.target.value)} className="w-full h-9 bg-zinc-50 border border-zinc-200 rounded-lg px-2 font-bold outline-none focus:border-[#f0592a]" />
                                </div>
                                <div className="space-y-1">
                                    <span className="font-medium text-zinc-500 text-[11px]">Cao (cm)</span>
                                    <input type="number" step="0.5" value={selectedObjectProps.heightCm} onChange={(e) => handlePropChange('heightCm', e.target.value)} className="w-full h-9 bg-zinc-50 border border-zinc-200 rounded-lg px-2 font-bold outline-none focus:border-[#f0592a]" />
                                </div>
                                <div className="space-y-1">
                                    <span className="font-medium text-zinc-500 text-[11px]">Xoay (°)</span>
                                    <input type="number" step="5" value={selectedObjectProps.rotation} onChange={(e) => handlePropChange('rotation', e.target.value)} className="w-full h-9 bg-zinc-50 border border-zinc-200 rounded-lg px-2 font-bold outline-none focus:border-[#f0592a]" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-zinc-400 text-xs text-center py-8">Vui lòng chọn 1 đối tượng trên áo để chỉnh sửa thuộc tính</p>
                    )}

                    {/* DANH SÁCH LỚP THIẾT KẾ */}
                    <div className="space-y-2 border-t border-zinc-100 pt-3">
                        <span className="font-bold text-zinc-400 uppercase text-[11px]">Lớp thiết kế ({layers.length})</span>
                        <div className="space-y-1.5 max-h-40 overflow-y-auto">
                            {layers.map((layer) => {
                                const isSelected = selectedObjectProps?.id === layer.id;
                                return (
                                    <div
                                        key={layer.id}
                                        onClick={() => {
                                            const c = getActiveCanvas();
                                            if (c) {
                                                c.setActiveObject(layer.fabricObj);
                                                c.renderAll();
                                                setSelectedObjectProps(extractObjectProps(layer.fabricObj));
                                            }
                                        }}
                                        className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition-colors ${isSelected ? 'bg-[#fefccf]/60 border-[#f0592a] font-bold text-zinc-950' : 'bg-zinc-50 border-zinc-200/80 text-zinc-800 hover:bg-zinc-100'}`}
                                    >
                                        <span className="truncate flex items-center">
                                            <GripVertical className="w-3.5 h-3.5 inline mr-1.5 text-zinc-400 shrink-0"/>
                                            {layer.name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL THÔNG BÁO LƯU THIẾT KẾ GIỮA MÀN HÌNH */}
            {saveDialog.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-xs p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200/80 max-w-md w-full p-6 relative overflow-hidden">
                        {/* Nút đóng góc phải */}
                        <button
                            type="button"
                            onClick={() => setSaveDialog({ ...saveDialog, isOpen: false })}
                            className="absolute top-4 right-4 w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Icon trạng thái */}
                        <div className="flex flex-col items-center text-center">
                            <div
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border ${
                                    saveDialog.type === 'success'
                                        ? 'bg-[#fefccf] text-[#f0592a] border-[#f0592a]/20'
                                        : 'bg-red-50 text-red-500 border-red-200'
                                }`}
                            >
                                {saveDialog.type === 'success' ? (
                                    <CheckCircle2 className="w-8 h-8" />
                                ) : (
                                    <AlertCircle className="w-8 h-8" />
                                )}
                            </div>

                            <h3 className="text-lg font-bold text-zinc-950">
                                {saveDialog.title}
                            </h3>
                            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                                {saveDialog.message}
                            </p>

                            {/* Hiển thị Mã thiết kế, Phiên bản & Ảnh thu nhỏ nếu lưu thành công */}
                            {saveDialog.type === 'success' && (
                                <div className="w-full mt-4 space-y-3">
                                    {saveDialog.previewUrl && (
                                        <div className="rounded-xl border border-zinc-200 overflow-hidden bg-zinc-50 p-1.5">
                                            <img
                                                src={saveDialog.previewUrl}
                                                alt="Bản xem trước 2 mặt"
                                                className="w-full h-36 object-contain rounded-lg bg-white"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                            {/* Nút hành động */}
                            <div className="w-full flex items-center gap-2.5 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const targetDesignId = saveDialog.designId;
                                        setSaveDialog({ ...saveDialog, isOpen: false });
                                        navigate(`/design-studio/${targetDesignId}/proposals`, {
                                            state: {
                                                designId: targetDesignId,
                                                versionId: saveDialog.versionId,
                                                title: designTitle,
                                                garmentColor: garmentColor,
                                                previewUrl: saveDialog.previewUrl
                                            }
                                        });
                                    }}
                                    className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#f0592a] hover:bg-[#d94a1f] text-white shadow-xs transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                                >
                                    <span>Nhận báo giá</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}