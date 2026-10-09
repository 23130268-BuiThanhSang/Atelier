import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Palette,
    Edit2,
    PenTool,
    Box,
    CheckCircle2,
    Bookmark,
    ImagePlus,
    Type,
    Shapes,
    Scissors,
    Undo2,
    Redo2,
    Trash2,
    Maximize2,
    Minimize2,
    Grid,
    Check,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Crosshair,
    Lock,
    Unlock,
    RotateCw,
    Eye,
    EyeOff,
    Plus,
    ArrowRight,
    FileSpreadsheet,
    GripVertical
} from 'lucide-react';

export default function DesignStudio() {
    const navigate = useNavigate();

    // State quản lý tiêu đề & chế độ xem
    const [designTitle, setDesignTitle] = useState('Vintage Sunburst Echo - Áo thun Graphic Heavyweight');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [viewSide, setViewSide] = useState('front'); // 'front' | 'back'
    const [selectedColor, setSelectedColor] = useState('#F5F2DC');

    // State viewport canvas
    const [zoomLevel, setZoomLevel] = useState(100);
    const [showGrid, setShowGrid] = useState(true);
    const [showBounds, setShowBounds] = useState(true);

    // State tọa độ & biến đổi họa tiết đang chọn
    const [posX, setPosX] = useState(180);
    const [posY, setPosY] = useState(240);
    const [widthCm, setWidthCm] = useState(28.0);
    const [heightCm, setHeightCm] = useState(22.4);
    const [rotation, setRotation] = useState(0);
    const [printMethod, setPrintMethod] = useState('dtg'); // 'dtg' | 'screenprint'

    // Danh sách Layer quản lý
    const [layers, setLayers] = useState([
        { id: 1, name: 'Họa tiết Vector Sunburst', type: 'image', visible: true, locked: false },
        { id: 2, name: 'Chữ Atelier Serif - Mặt trước', type: 'text', visible: true, locked: false },
        { id: 3, name: 'Màu nền phôi áo (Kem ấm)', type: 'base', visible: true, locked: true },
    ]);

    const toggleLayerVisibility = (id) => {
        setLayers(layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)));
    };

    const toggleLayerLock = (id) => {
        setLayers(layers.map((l) => (l.id === id ? { ...l, locked: !l.locked } : l)));
    };

    // Danh sách bảng màu phôi áo
    const garmentColors = [
        { name: 'Kem ấm (Warm Cream)', hex: '#F5F2DC' },
        { name: 'Đen Vintage (Vintage Charcoal)', hex: '#1A1A1A' },
        { name: 'Trắng quang học (Optic White)', hex: '#FFFFFF', hasBorder: true },
        { name: 'Xám tiêu (Heather Gray)', hex: '#D1D1C7' },
        { name: 'Xanh Navy đại dương (Atlantic Navy)', hex: '#233446' },
    ];

    return (
        <div className="w-full bg-[#fefccf] min-h-screen py-5 px-3 sm:px-6 xl:px-10 space-y-4">

            {/* 1. THANH CÔNG CỤ ĐIỀU HÀNH XƯỞNG THIẾT KẾ (TOP STUDIO TOOLBAR) */}
            <div className="w-full bg-white rounded-2xl shadow-xs border border-zinc-200/70 p-3.5 sm:p-4 flex flex-col xl:flex-row items-center justify-between gap-4">

                {/* Tiêu đề & Mã định danh */}
                <div className="flex items-center gap-3 w-full xl:w-auto">
                    <div className="w-10 h-10 rounded-xl bg-[#fefccf] text-[#f0592a] border border-[#f0592a]/20 flex items-center justify-center shrink-0">
                        <Palette className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                            {isEditingTitle ? (
                                <input
                                    type="text"
                                    value={designTitle}
                                    onChange={(e) => setDesignTitle(e.target.value)}
                                    onBlur={() => setIsEditingTitle(false)}
                                    autoFocus
                                    className="font-bold text-sm sm:text-base text-zinc-950 bg-zinc-50 border border-zinc-300 rounded-lg px-2 py-0.5 outline-none focus:border-[#f0592a]"
                                />
                            ) : (
                                <span className="font-bold text-sm sm:text-base text-zinc-950 truncate max-w-[280px] sm:max-w-md">
                  {designTitle}
                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => setIsEditingTitle(!isEditingTitle)}
                                className="text-zinc-400 hover:text-[#f0592a] transition-colors"
                                title="Đổi tên thiết kế"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cụm chuyển đổi 2D/3D & Mặt áo Trước/Sau */}
                <div className="flex flex-wrap items-center justify-center gap-2 bg-zinc-100 p-1.5 rounded-xl border border-zinc-200/60">
                    {/* Nút chế độ 2D / 3D */}
                    <div className="inline-flex p-0.5 bg-white rounded-lg shadow-2xs border border-zinc-200/60">
                        <button
                            type="button"
                            className="px-3 py-1.5 rounded-md bg-[#f0592a] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs"
                        >
                            <PenTool className="w-3.5 h-3.5" />
                            <span>Biên tập 2D</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/design-studio/3d')}
                            className="px-3 py-1.5 rounded-md text-zinc-600 hover:text-[#f0592a] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                        >
                            <Box className="w-3.5 h-3.5" />
                            <span>Xem trước 3D</span>
                        </button>
                    </div>

                    <div className="h-4 w-px bg-zinc-300 hidden sm:block"></div>

                    {/* Chọn Mặt trước / Mặt sau */}
                    <div className="inline-flex gap-1">
                        <button
                            type="button"
                            onClick={() => setViewSide('front')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                viewSide === 'front'
                                    ? 'bg-white text-zinc-950 shadow-2xs border border-zinc-200/80 font-bold'
                                    : 'text-zinc-600 hover:text-zinc-950'
                            }`}
                        >
                            <span className={`w-2 h-2 rounded-full ${viewSide === 'front' ? 'bg-[#f0592a]' : 'bg-transparent border border-zinc-400'}`}></span>
                            <span>Mặt trước</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewSide('back')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                viewSide === 'back'
                                    ? 'bg-white text-zinc-950 shadow-2xs border border-zinc-200/80 font-bold'
                                    : 'text-zinc-600 hover:text-zinc-950'
                            }`}
                        >
                            <span className={`w-2 h-2 rounded-full ${viewSide === 'back' ? 'bg-[#f0592a]' : 'bg-transparent border border-zinc-400'}`}></span>
                            <span>Mặt sau</span>
                        </button>
                    </div>
                </div>

                {/* Huy hiệu kiểm định & Thao tác lưu */}
                <div className="flex flex-wrap items-center justify-end gap-2 w-full xl:w-auto">
                    <button
                        type="button"
                        className="px-4 py-2 bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                    >
                        <Bookmark className="w-4 h-4 text-zinc-400" />
                        <span>Lưu nháp</span>
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-[#f0592a] hover:bg-[#d94a1f] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-[0.98]"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Lưu & Kiểm tra</span>
                    </button>
                </div>
            </div>

            {/* 2. KHU VỰC KHÔNG GIAN THIẾT KẾ (3 CỘT: CÔNG CỤ TRÁI - CANVAS GIỮA - THUỘC TÍNH PHẢI) */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

                {/* CỘT 1: THANH CÔNG CỤ TRÁI (Tools & Color Picker) */}
                <div className="lg:col-span-1 xl:col-span-1 bg-white rounded-2xl shadow-xs border border-zinc-200/70 p-3 flex lg:flex-col items-center justify-between lg:justify-start gap-4 overflow-x-auto lg:overflow-visible">
                    {/* Nhóm thêm đối tượng */}
                    <div className="flex lg:flex-col items-center gap-2 w-full">
                        <button
                            type="button"
                            className="w-12 h-12 rounded-xl bg-[#faf8e4] text-[#f0592a] hover:bg-[#f0592a] hover:text-white transition-all flex flex-col items-center justify-center group relative border border-[#f0592a]/20"
                            title="Thêm hình ảnh / Logo"
                        >
                            <ImagePlus className="w-5 h-5" />
                            <span className="text-[9px] font-bold mt-0.5">Ảnh</span>
                        </button>
                        <button
                            type="button"
                            className="w-12 h-12 rounded-xl bg-zinc-50 text-zinc-600 hover:text-[#f0592a] hover:bg-[#faf8e4] transition-all flex flex-col items-center justify-center border border-zinc-200/60"
                            title="Thêm văn bản chữ"
                        >
                            <Type className="w-5 h-5" />
                            <span className="text-[9px] font-semibold mt-0.5">Chữ</span>
                        </button>
                        <button
                            type="button"
                            className="w-12 h-12 rounded-xl bg-zinc-50 text-zinc-600 hover:text-[#f0592a] hover:bg-[#faf8e4] transition-all flex flex-col items-center justify-center border border-zinc-200/60"
                            title="Thư viện họa tiết nghệ nhân"
                        >
                            <Shapes className="w-5 h-5" />
                            <span className="text-[9px] font-semibold mt-0.5">Họa tiết</span>
                        </button>
                        <button
                            type="button"
                            className="w-12 h-12 rounded-xl bg-zinc-50 text-zinc-600 hover:text-[#f0592a] hover:bg-[#faf8e4] transition-all flex flex-col items-center justify-center border border-zinc-200/60"
                            title="Kiểu dáng phom áo"
                        >
                            <Scissors className="w-5 h-5" />
                            <span className="text-[9px] font-semibold mt-0.5">Phom</span>
                        </button>
                    </div>

                    <div className="w-full h-px bg-zinc-200 hidden lg:block my-0.5"></div>

                    {/* Chọn màu phôi áo */}
                    <div className="flex lg:flex-col items-center gap-2.5 py-1">
                        <span className="text-[10px] uppercase font-bold text-zinc-400 hidden lg:block tracking-wider">Màu áo</span>
                        {garmentColors.map((color, idx) => (
                            <button
                                key={idx}
                                type="button"
                                aria-label={color.name}
                                onClick={() => setSelectedColor(color.hex)}
                                style={{ backgroundColor: color.hex }}
                                className={`w-7 h-7 rounded-full transition-transform hover:scale-110 shrink-0 ${
                                    color.hasBorder ? 'border border-zinc-300' : ''
                                } ${
                                    selectedColor === color.hex
                                        ? 'ring-2 ring-[#f0592a] ring-offset-2 ring-offset-white shadow-xs'
                                        : 'shadow-2xs'
                                }`}
                                title={color.name}
                            />
                        ))}
                    </div>

                    <div className="w-full h-px bg-zinc-200 hidden lg:block my-0.5"></div>

                    {/* Thao tác Lùi / Tiến / Xóa */}
                    <div className="flex lg:flex-col items-center gap-2">
                        <button
                            type="button"
                            className="w-8 h-8 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 flex items-center justify-center transition-colors"
                            title="Hoàn tác (Ctrl+Z)"
                        >
                            <Undo2 className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            className="w-8 h-8 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 flex items-center justify-center transition-colors"
                            title="Làm lại (Ctrl+Y)"
                        >
                            <Redo2 className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            className="w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                            title="Xóa đối tượng đang chọn"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* CỘT 2: KHÔNG GIAN BÀN VẼ CANVAS CHÍNH (CENTER STAGE) */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-2 relative min-w-0">
                    <div className="w-full bg-white rounded-2xl shadow-xs border border-zinc-200/70 p-4 relative min-h-[580px] sm:min-h-[660px] flex items-center justify-center overflow-hidden select-none">

                        {/* Thanh thông số góc trên Canvas */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10 flex-wrap gap-2">
                            <div className="hidden sm:flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl shadow-2xs border border-zinc-200 text-xs">
                                <span className="text-zinc-400 font-semibold uppercase text-[10px]">Tỉ lệ hiển thị:</span>
                                <span className="font-bold text-zinc-900">{zoomLevel}% (Tỉ lệ chuẩn 1:1)</span>
                            </div>
                        </div>

                        {/* Khung mô phỏng Áo phôi & Decal */}
                        <div className="relative w-full max-w-[480px] h-[520px] sm:h-[600px] flex items-center justify-center">

                            {/* Hình ảnh phôi áo */}
                            <div className="relative w-full h-full flex items-center justify-center">
                                <img
                                    src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80"
                                    alt="Phôi áo thun may mặc"
                                    className="w-full h-full object-contain pointer-events-none filter drop-shadow-md"
                                />

                                {/* Khung giới hạn in an toàn (Direct-to-Garment bounds) */}
                                {showBounds && (
                                    <div className="absolute w-[240px] sm:w-[270px] h-[330px] sm:h-[370px] top-[22%] border-2 border-dashed border-[#f0592a]/40 rounded-sm pointer-events-none flex flex-col justify-between p-2">
                                        <div className="flex justify-between items-center text-[9px] font-mono font-bold text-[#f0592a]/70 uppercase">
                                            <span>┌ RỘNG 14"</span>
                                            <span>DÀI 18" ┐</span>
                                        </div>

                                        {/* Tâm ngắm căn giữa */}
                                        {showGrid && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                                <div className="w-full h-px bg-[#f0592a]"></div>
                                                <div className="h-full w-px bg-[#f0592a] absolute"></div>
                                            </div>
                                        )}

                                        {/* Đối tượng đồ họa đang được tương tác (Active Graphic Box) */}
                                        <div
                                            style={{
                                                transform: `rotate(${rotation}deg)`,
                                            }}
                                            className="absolute top-[36px] left-[28px] w-[185px] h-[165px] group cursor-move pointer-events-auto border-2 border-[#f0592a] bg-[#f0592a]/5 rounded shadow-xs"
                                        >
                                            {/* Ảnh họa tiết in */}
                                            <div className="w-full h-full p-2 relative overflow-hidden flex flex-col items-center justify-center">
                                                <img
                                                    src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=300&auto=format&fit=crop&q=80"
                                                    alt="Họa tiết Sunburst"
                                                    className="w-full h-full object-contain select-none"
                                                />
                                                <span className="absolute bottom-1.5 text-center text-[10px] tracking-widest text-zinc-950 uppercase font-black drop-shadow-xs">
                          ECHO • ATELIER
                        </span>
                                            </div>

                                            {/* Các điểm neo kéo dãn (Transform handles) */}
                                            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#f0592a] rounded-sm shadow-xs"></div>
                                            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#f0592a] rounded-sm shadow-xs"></div>
                                            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#f0592a] rounded-sm shadow-xs"></div>
                                            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#f0592a] rounded-sm shadow-xs cursor-nwse-resize"></div>

                                            {/* Trục xoay góc trên */}
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                                <div className="w-4 h-4 rounded-full bg-[#f0592a] text-white flex items-center justify-center shadow-xs cursor-grab">
                                                    <RotateCw className="w-2.5 h-2.5" />
                                                </div>
                                                <div className="w-0.5 h-2 bg-[#f0592a]"></div>
                                            </div>

                                            {/* Tooltip kích thước thực & độ phân giải */}
                                            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap shadow-md">
                                                28.0 cm × 22.4 cm (312 DPI)
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-end text-[9px] font-mono font-bold text-[#f0592a]/70 uppercase">
                                            <span>└ GIỚI HẠN VẢI</span>
                                            <span>CÁCH ĐƯỜNG MAY 1.5" ┘</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thanh điều khiển phụ dưới đáy Canvas (Zoom, Grid, Bounds) */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-zinc-200 px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-3 z-10 text-xs">
                            {/* Thu phóng */}
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                                    className="w-7 h-7 rounded-full text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 flex items-center justify-center transition-colors"
                                    title="Thu nhỏ"
                                >
                                    <Minimize2 className="w-3.5 h-3.5" />
                                </button>
                                <span className="font-bold text-zinc-800 px-1 min-w-[42px] text-center font-mono">
                  {zoomLevel}%
                </span>
                                <button
                                    type="button"
                                    onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                                    className="w-7 h-7 rounded-full text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 flex items-center justify-center transition-colors"
                                    title="Phóng to"
                                >
                                    <Maximize2 className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="w-px h-4 bg-zinc-200"></div>

                            {/* Bật/Tắt Lưới căn chỉnh */}
                            <button
                                type="button"
                                onClick={() => setShowGrid(!showGrid)}
                                className={`flex items-center gap-1 font-semibold transition-colors ${
                                    showGrid ? 'text-[#f0592a]' : 'text-zinc-400 hover:text-zinc-700'
                                }`}
                            >
                                <Grid className="w-3.5 h-3.5" />
                                <span>Lưới</span>
                            </button>

                            <div className="w-px h-4 bg-zinc-200"></div>

                            {/* Bật/Tắt Khung in an toàn */}
                            <button
                                type="button"
                                onClick={() => setShowBounds(!showBounds)}
                                className={`flex items-center gap-1 font-semibold transition-colors ${
                                    showBounds ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-700'
                                }`}
                            >
                                <Crosshair className="w-3.5 h-3.5" />
                                <span>Khung an toàn</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* CỘT 3: BẢNG THUỘC TÍNH & QUẢN LÝ LỚP LAYER (PROPERTIES INSPECTOR) */}
                <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-3 min-w-0">

                    {/* Card Thuộc tính chi tiết */}
                    <div className="w-full bg-white rounded-2xl shadow-xs p-4 sm:p-5 border border-zinc-200/70 flex flex-col gap-4">

                        {/* Header Thuộc tính */}
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-zinc-950">Thuộc tính đối tượng</h3>
                            </div>
                            <button type="button" className="text-zinc-400 hover:text-red-600 transition-colors" title="Xóa layer">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Thông tin đối tượng đang chọn */}
                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60">
                            <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center border border-zinc-200 shrink-0 shadow-2xs">
                                <Shapes className="w-5 h-5 text-[#f0592a]" />
                            </div>
                            <div className="flex flex-col min-w-0 flex-1 text-xs">
                                <span className="font-bold text-zinc-900 truncate">Sunburst_Vintage_Vector.svg</span>
                                <span className="text-zinc-400 text-[11px]">Gốc: 1200×960px • 4 Màu in</span>
                            </div>
                        </div>

                        {/* Công cụ căn hàng nhanh */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                                Căn chỉnh vị trí trên áo
                            </label>
                            <div className="grid grid-cols-4 gap-1 bg-zinc-100 p-1 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => setPosX(50)}
                                    className="h-8 rounded-lg bg-white text-zinc-700 hover:text-[#f0592a] flex items-center justify-center shadow-2xs transition-colors"
                                    title="Căn trái"
                                >
                                    <AlignLeft className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPosX(180)}
                                    className="h-8 rounded-lg bg-white text-zinc-700 hover:text-[#f0592a] flex items-center justify-center shadow-2xs transition-colors"
                                    title="Căn giữa ngang"
                                >
                                    <AlignCenter className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPosX(300)}
                                    className="h-8 rounded-lg bg-white text-zinc-700 hover:text-[#f0592a] flex items-center justify-center shadow-2xs transition-colors"
                                    title="Căn phải"
                                >
                                    <AlignRight className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setPosX(180); setPosY(240); }}
                                    className="h-8 rounded-lg bg-white text-zinc-700 hover:text-[#f0592a] flex items-center justify-center shadow-2xs transition-colors"
                                    title="Căn chính tâm ngực"
                                >
                                    <Crosshair className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Tọa độ vị trí & Kích thước */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="space-y-1">
                                <span className="font-medium text-zinc-500">Tọa độ X</span>
                                <div className="flex items-center h-10 px-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus-within:border-[#f0592a]">
                                    <span className="text-zinc-400 mr-1 font-mono">X</span>
                                    <input
                                        type="number"
                                        value={posX}
                                        onChange={(e) => setPosX(Number(e.target.value))}
                                        className="w-full bg-transparent font-bold text-zinc-900 outline-none"
                                    />
                                    <span className="text-zinc-400 text-[10px]">px</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="font-medium text-zinc-500">Tọa độ Y</span>
                                <div className="flex items-center h-10 px-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus-within:border-[#f0592a]">
                                    <span className="text-zinc-400 mr-1 font-mono">Y</span>
                                    <input
                                        type="number"
                                        value={posY}
                                        onChange={(e) => setPosY(Number(e.target.value))}
                                        className="w-full bg-transparent font-bold text-zinc-900 outline-none"
                                    />
                                    <span className="text-zinc-400 text-[10px]">px</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-zinc-500">Chiều rộng</span>
                                    <Lock className="w-3 h-3 text-[#f0592a]" />
                                </div>
                                <div className="flex items-center h-10 px-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus-within:border-[#f0592a]">
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={widthCm}
                                        onChange={(e) => setWidthCm(Number(e.target.value))}
                                        className="w-full bg-transparent font-bold text-zinc-900 outline-none"
                                    />
                                    <span className="text-zinc-400 text-[10px]">cm</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-zinc-500">Chiều cao</span>
                                    <Lock className="w-3 h-3 text-[#f0592a]" />
                                </div>
                                <div className="flex items-center h-10 px-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus-within:border-[#f0592a]">
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={heightCm}
                                        onChange={(e) => setHeightCm(Number(e.target.value))}
                                        className="w-full bg-transparent font-bold text-zinc-900 outline-none"
                                    />
                                    <span className="text-zinc-400 text-[10px]">cm</span>
                                </div>
                            </div>
                        </div>

                        {/* Góc xoay đối tượng */}
                        <div className="space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-zinc-500">Góc xoay</span>
                                <span className="font-bold text-zinc-900 font-mono">{rotation}°</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="range"
                                    min="-180"
                                    max="180"
                                    value={rotation}
                                    onChange={(e) => setRotation(Number(e.target.value))}
                                    className="w-full accent-[#f0592a] cursor-pointer"
                                />
                                <button
                                    type="button"
                                    onClick={() => setRotation(0)}
                                    className="text-zinc-600 hover:text-zinc-950 text-xs font-semibold px-2 py-1 rounded bg-zinc-100 transition-colors"
                                >
                                    0°
                                </button>
                            </div>
                        </div>

                        {/* Công nghệ in & Chỉ số DPI */}
                        <div className="p-3 bg-zinc-50 rounded-xl space-y-2.5 border border-zinc-200/60 text-xs">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Công nghệ in đề xuất</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <label
                                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                                        printMethod === 'dtg'
                                            ? 'bg-white border-[#f0592a] shadow-2xs'
                                            : 'bg-white/60 border-zinc-200'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="printMethod"
                                        checked={printMethod === 'dtg'}
                                        onChange={() => setPrintMethod('dtg')}
                                        className="accent-[#f0592a]"
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-bold text-zinc-900">In trực tiếp (DTG)</span>
                                        <span className="text-[10px] text-zinc-400">Đa sắc quang phổ</span>
                                    </div>
                                </label>

                                <label
                                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                                        printMethod === 'screenprint'
                                            ? 'bg-white border-[#f0592a] shadow-2xs'
                                            : 'bg-white/60 border-zinc-200'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="printMethod"
                                        checked={printMethod === 'screenprint'}
                                        onChange={() => setPrintMethod('screenprint')}
                                        className="accent-[#f0592a]"
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-bold text-zinc-900">In lụa thủ công</span>
                                        <span className="text-[10px] text-zinc-400">4 Màu sắc tố</span>
                                    </div>
                                </label>
                            </div>

                            {/* Đồng hồ đo DPI xuất xưởng */}
                            <div className="flex items-center justify-between pt-1 border-t border-zinc-200/60 text-[11px]">
                                <span className="text-zinc-500">Độ phân giải bản in:</span>
                                <span className="font-bold text-emerald-700">312 DPI (Sắc nét cao)</span>
                            </div>
                        </div>

                        {/* Quản lý danh sách lớp (Layer Stack) */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-400 uppercase tracking-wider text-[11px]">
                  Danh sách lớp ({layers.length})
                </span>
                                <button
                                    type="button"
                                    className="text-[#f0592a] font-bold text-xs hover:underline flex items-center gap-0.5"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Thêm lớp</span>
                                </button>
                            </div>

                            <div className="space-y-1.5">
                                {layers.map((layer) => (
                                    <div
                                        key={layer.id}
                                        className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-all ${
                                            layer.id === 1
                                                ? 'bg-[#faf8e4] border-[#f0592a]/30 shadow-2xs'
                                                : 'bg-zinc-50 border-zinc-200/80 hover:bg-zinc-100/60'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <GripVertical className="w-3.5 h-3.5 text-zinc-400 cursor-grab shrink-0" />
                                            <button
                                                type="button"
                                                onClick={() => toggleLayerVisibility(layer.id)}
                                                className="text-zinc-500 hover:text-zinc-900"
                                                title={layer.visible ? 'Ẩn lớp' : 'Hiện lớp'}
                                            >
                                                {layer.visible ? (
                                                    <Eye className="w-4 h-4 text-[#f0592a]" />
                                                ) : (
                                                    <EyeOff className="w-4 h-4 text-zinc-400" />
                                                )}
                                            </button>
                                            <span className="font-semibold text-zinc-900 truncate">{layer.name}</span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => toggleLayerLock(layer.id)}
                                            className="text-zinc-400 hover:text-zinc-700 p-1"
                                            title={layer.locked ? 'Mở khóa lớp' : 'Khóa lớp'}
                                        >
                                            {layer.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Nút hành động chính: Chuyển sang xem trước 3D */}
                        <div className="pt-2 border-t border-zinc-100 space-y-1.5">
                            <button
                                type="button"
                                onClick={() => navigate('/design-studio/3d')}
                                className="w-full h-12 bg-[#f0592a] hover:bg-[#d94a1f] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98]"
                            >
                                <span>Chuyển sang Xem trước 3D</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}