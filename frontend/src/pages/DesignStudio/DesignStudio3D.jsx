import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    PenTool,
    Box,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Sun,
    Sunset,
    Lightbulb,
    RotateCw,
    Maximize2,
    Minimize2,
    Camera,
    Layers,
    Sparkles,
    ShieldCheck,
    Leaf,
    ExternalLink,
    Sliders,
    Check
} from 'lucide-react';

export default function DesignStudio3D() {
    const navigate = useNavigate();

    // State màu sắc áo
    const [activeColor, setActiveColor] = useState({
        name: 'Kem cổ điển (Warm Antique Cream)',
        hex: '#fefccf'
    });

    // State góc quay & ánh sáng 3D
    const [cameraAngle, setCameraAngle] = useState('front'); // 'front' | 'angled' | 'side' | 'back'
    const [lightPreset, setLightPreset] = useState('studio'); // 'studio' | 'golden' | 'clean'
    const [drapeMode, setDrapeMode] = useState('street'); // 'street' | 'tucked' | 'motion'
    const [rotationAngle, setRotationAngle] = useState(0);

    // State mô phỏng hình thể ma-nơ-canh (Fit Simulator)
    const [avatarGender, setAvatarGender] = useState('male'); // 'male' | 'female' | 'unisex'
    const [height, setHeight] = useState(180);
    const [chest, setChest] = useState(102);
    const [shoulder, setShoulder] = useState(48);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [captureSuccess, setCaptureSuccess] = useState(false);

    // Danh sách màu áo
    const colorList = [
        { name: 'Kem cổ điển (Warm Antique Cream)', hex: '#fefccf', border: true },
        { name: 'Đen than chì (Charcoal Pitch)', hex: '#1d1d03' },
        { name: 'Trắng quang học (Optic Pure White)', hex: '#ffffff', border: true },
        { name: 'Đất nung (Earth Terracotta)', hex: '#594139' },
        { name: 'Xanh Olive thô (Raw Flax Olive)', hex: '#dedcb1' }
    ];

    // Chuyển góc camera
    const handleCameraChange = (angle) => {
        setCameraAngle(angle);
        if (angle === 'front') setRotationAngle(0);
        if (angle === 'angled') setRotationAngle(45);
        if (angle === 'side') setRotationAngle(90);
        if (angle === 'back') setRotationAngle(180);
    };

    // Giả lập chụp ảnh Render 4K
    const handleCapture = () => {
        setIsCapturing(true);
        setTimeout(() => {
            setIsCapturing(false);
            setCaptureSuccess(true);
            setTimeout(() => setCaptureSuccess(false), 2500);
        }, 1200);
    };

    // Tính cỡ áo gợi ý theo vòng ngực
    const getChestSizeLabel = (val) => {
        if (val < 94) return 'Size S';
        if (val <= 104) return 'Size L khuyến nghị';
        if (val <= 114) return 'Size XL khuyến nghị';
        return 'Size 2XL khuyến nghị';
    };

    return (
        <div className="w-full bg-[#fefccf] min-h-screen py-5 px-3 sm:px-6 xl:px-10 space-y-4">

            {/* 1. THANH ĐIỀU HƯỚNG & TRẠNG THÁI TRÊN CÙNG (TOP ACTION BAR) */}
            <div className="w-full bg-white rounded-2xl p-3.5 sm:p-4 shadow-xs border border-zinc-200/70 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
                    <nav className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium flex-wrap">
                        <Link to="/design-studio" className="hover:text-zinc-900 transition-colors">Xưởng thiết kế</Link>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="text-zinc-700 font-semibold truncate">Vintage Sunburst Echo</span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="text-[#f0592a] font-bold">Mô phỏng 3D chân thực</span>
                    </nav>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Nút chuyển chế độ 2D / 3D */}
                    <div className="bg-zinc-100 p-1 rounded-xl flex items-center gap-1 border border-zinc-200/60">
                        <button
                            type="button"
                            onClick={() => navigate('/design-studio')}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 hover:text-zinc-950 flex items-center gap-1.5 transition-all"
                        >
                            <PenTool className="w-3.5 h-3.5" />
                            <span>Biên tập 2D</span>
                        </button>
                        <button
                            type="button"
                            className="px-3.5 py-1.5 rounded-lg bg-[#f0592a] text-white text-xs font-bold shadow-2xs flex items-center gap-1.5"
                        >
                            <Box className="w-3.5 h-3.5" />
                            <span>Xem trước 3D</span>
                        </button>
                    </div>

                    <button
                        type="button"
                        className="px-5 py-2 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] text-white font-bold text-xs shadow-xs active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                        <span>Tiến hành Xuất bản</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* 2. KHÔNG GIAN BÀN THIẾT KẾ 3D (3 CỘT: THÔNG SỐ VẢI - SÂN KHẤU 3D - MÔ PHỎNG PHOM BODY) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

                {/* CỘT TRÁI (3 Cột): Thuộc tính vải & Dáng rủ */}
                <div className="lg:col-span-3 flex flex-col gap-3 order-2 lg:order-1 min-w-0">

                    {/* Thông số kỹ thuật vải & in ấn */}
                    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-zinc-200/70 space-y-3.5">
                        <div>
                            <h3 className="text-base font-bold text-zinc-950 leading-tight">Artisan Boxy Heavyweight</h3>
                        </div>

                        {/* Bảng chọn màu */}
                        <div className="pt-1 space-y-2 border-t border-zinc-100">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-500">Màu sắc đang chọn</span>
                                <span className="font-bold text-zinc-900 truncate max-w-[140px] text-right">{activeColor.name}</span>
                            </div>
                            <div className="flex items-center gap-2.5 pt-0.5">
                                {colorList.map((col, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setActiveColor(col)}
                                        style={{ backgroundColor: col.hex }}
                                        className={`w-7 h-7 rounded-full shadow-2xs transition-transform hover:scale-110 shrink-0 ${
                                            col.border ? 'border border-zinc-300' : ''
                                        } ${
                                            activeColor.hex === col.hex ? 'ring-2 ring-[#f0592a] ring-offset-2 ring-offset-white' : ''
                                        }`}
                                        title={col.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Thông số kỹ thuật in */}
                        <div className="bg-zinc-50 rounded-xl p-3 space-y-2 border border-zinc-200/60 text-xs">
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-500">Công nghệ áp dụng:</span>
                                <span className="text-[#f0592a] font-bold">Direct-to-Film (DTF)</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-500">Bề mặt hoàn thiện:</span>
                                <span className="font-semibold text-zinc-900">Mờ hạt mịn (Matte)</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-zinc-500">Độ phân giải Vector:</span>
                                <span className="font-bold text-emerald-700">1200 DPI Vector-Bake</span>
                            </div>
                        </div>
                    </div>

                    {/* Mô phỏng độ rủ vải tự nhiên (Drape & Pose Mode) */}
                    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-zinc-200/70 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-zinc-950">Mô phỏng nếp nhăn & Độ rủ</span>
                            <Sliders className="w-4 h-4 text-[#f0592a]" />
                        </div>

                        <div className="space-y-2 pt-1 text-xs">
                            {[
                                { id: 'street', label: 'Dáng suông Streetwear', sub: 'Mặc định' },
                                { id: 'tucked', label: 'Sơ vin vạt trước (French-Tuck)', sub: 'Gọn gàng' },
                                { id: 'motion', label: 'Chuyển động trong gió', sub: 'Gió 4m/s' }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setDrapeMode(item.id)}
                                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                                        drapeMode === item.id
                                            ? 'bg-[#faf8e4] border-[#f0592a] font-bold text-zinc-950 shadow-2xs'
                                            : 'bg-zinc-50 hover:bg-zinc-100/70 border-zinc-200 text-zinc-700'
                                    }`}
                                >
                  <span className="flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                        drapeMode === item.id ? 'border-[#f0592a] bg-[#f0592a]' : 'border-zinc-400 bg-white'
                    }`}>
                      {drapeMode === item.id && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                    </span>
                    <span>{item.label}</span>
                  </span>
                                    <span className="text-[10px] text-zinc-400 font-normal">{item.sub}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                {/* CỘT GIỮA (6 Cột): Sân khấu hiển thị 3D tương tác (3D Viewport Stage) */}
                <div className="lg:col-span-6 flex flex-col gap-3 order-1 lg:order-2 min-w-0">
                    <div className="relative bg-white rounded-2xl shadow-sm border border-zinc-200/70 overflow-hidden min-h-[580px] lg:min-h-[640px] flex flex-col justify-between select-none">

                        {/* Thanh điều khiển góc nhìn & ánh sáng phía trên */}
                        <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between gap-2 flex-wrap bg-gradient-to-b from-white/95 via-white/50 to-transparent">
                            {/* Preset góc máy */}
                            <div className="flex items-center gap-1 bg-zinc-100/90 p-1 rounded-xl shadow-2xs border border-zinc-200/60 text-xs">
                                {[
                                    { id: 'front', label: 'Mặt trước 0°' },
                                    { id: 'angled', label: 'Góc nghiêng 45°' },
                                    { id: 'side', label: 'Mặt bên 90°' },
                                    { id: 'back', label: 'Mặt sau 180°' }
                                ].map((btn) => (
                                    <button
                                        key={btn.id}
                                        type="button"
                                        onClick={() => handleCameraChange(btn.id)}
                                        className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                                            cameraAngle === btn.id
                                                ? 'bg-[#f0592a] text-white shadow-2xs'
                                                : 'text-zinc-600 hover:text-zinc-950'
                                        }`}
                                    >
                                        {btn.label}
                                    </button>
                                ))}
                            </div>

                            {/* Preset ánh sáng */}
                            <div className="flex items-center gap-1 bg-zinc-100/90 p-1 rounded-xl shadow-2xs border border-zinc-200/60 text-xs">
                                <button
                                    type="button"
                                    onClick={() => setLightPreset('studio')}
                                    className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                                        lightPreset === 'studio' ? 'bg-[#f0592a] text-white' : 'text-zinc-600 hover:text-zinc-950'
                                    }`}
                                    title="Ánh sáng phòng Studio dịu nhẹ"
                                >
                                    <Lightbulb className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Studio</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLightPreset('golden')}
                                    className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                                        lightPreset === 'golden' ? 'bg-[#f0592a] text-white' : 'text-zinc-600 hover:text-zinc-950'
                                    }`}
                                    title="Hoàng hôn ấm áp 3200K"
                                >
                                    <Sunset className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Hoàng hôn</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLightPreset('clean')}
                                    className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                                        lightPreset === 'clean' ? 'bg-[#f0592a] text-white' : 'text-zinc-600 hover:text-zinc-950'
                                    }`}
                                    title="Ban ngày tự nhiên 5500K"
                                >
                                    <Sun className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Ban ngày</span>
                                </button>
                            </div>
                        </div>

                        {/* Sân khấu hiển thị Ma-nơ-canh & Áo 3D */}
                        <div
                            style={{
                                filter:
                                    lightPreset === 'golden'
                                        ? 'sepia(0.2) saturate(1.2) brightness(1.03)'
                                        : lightPreset === 'clean'
                                            ? 'contrast(1.05) brightness(1.02)'
                                            : 'none'
                            }}
                            className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden transition-all duration-300"
                        >
                            <div
                                style={{
                                    transform: `rotateY(${rotationAngle}deg)`,
                                    transition: 'transform 0.4s ease-out'
                                }}
                                className="relative w-full h-full flex items-center justify-center"
                            >
                                {/* Hình ảnh mô hình áo trên người mẫu */}
                                <img
                                    src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"
                                    alt="Mô hình áo 3D mặc trên ma-nơ-canh"
                                    className="w-full h-full object-contain p-6 drop-shadow-xl"
                                />

                                {/* Lớp hiển thị bản đồ nhiệt độ căng vải (Heatmap Overlay) */}
                                {showHeatmap && (
                                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center mix-blend-multiply opacity-70">
                                        <svg className="w-[340px] h-[460px]" viewBox="0 0 340 460" fill="none">
                                            <path
                                                d="M70 70 C120 40, 220 40, 270 70 L310 160 L260 170 L240 440 L100 440 L80 170 L30 160 Z"
                                                fill="url(#heatGrad)"
                                                opacity="0.65"
                                            />
                                            <circle cx="95" cy="115" fill="#FFC107" filter="blur(8px)" opacity="0.6" r="28" />
                                            <circle cx="245" cy="115" fill="#FFC107" filter="blur(8px)" opacity="0.6" r="28" />
                                            <circle cx="170" cy="160" fill="#4CAF50" filter="blur(12px)" opacity="0.5" r="45" />
                                            <circle cx="170" cy="280" fill="#4CAF50" filter="blur(14px)" opacity="0.4" r="55" />
                                            <defs>
                                                <radialGradient id="heatGrad" cx="50%" cy="30%" r="60%">
                                                    <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.4" />
                                                    <stop offset="50%" stopColor="#8BC34A" stopOpacity="0.5" />
                                                    <stop offset="85%" stopColor="#FFEB3B" stopOpacity="0.6" />
                                                    <stop offset="100%" stopColor="#FF9800" stopOpacity="0.7" />
                                                </radialGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thanh công cụ nổi phía dưới sân khấu */}
                        <div className="relative z-10 p-4 flex items-center justify-between gap-3 bg-gradient-to-t from-white/95 via-white/50 to-transparent">

                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => handleCameraChange('front')}
                                    className="w-9 h-9 rounded-full bg-white hover:bg-zinc-100 shadow-2xs border border-zinc-200 flex items-center justify-center text-zinc-700 transition-colors"
                                    title="Đặt lại góc máy"
                                >
                                    <RotateCw className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    className="w-9 h-9 rounded-full bg-white hover:bg-zinc-100 shadow-2xs border border-zinc-200 flex items-center justify-center text-zinc-700 transition-colors"
                                    title="Toàn màn hình"
                                >
                                    <Maximize2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI (3 Cột): Mô phỏng hình thể người & Bảng giá sản xuất */}
                <div className="lg:col-span-3 flex flex-col gap-3 order-3 min-w-0">

                    {/* Bộ điều khiển hình thể Ma-nơ-canh (Fit Simulator) */}
                    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-zinc-200/70 space-y-3.5">
                        <div>
                            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Mô phỏng dáng người</span>
                            <h2 className="text-base font-bold text-zinc-950 mt-0.5">Trình thử phom & Kích thước</h2>
                        </div>

                        {/* Chọn giới tính người mẫu */}
                        <div className="space-y-1.5 text-xs">
                            <span className="font-semibold text-zinc-700">Dáng vóc cơ thể</span>
                            <div className="grid grid-cols-3 gap-1 bg-zinc-100 p-1 rounded-xl">
                                {[
                                    { id: 'male', label: 'Nam thể thao' },
                                    { id: 'female', label: 'Nữ chuẩn' },
                                    { id: 'unisex', label: 'Unisex rộng' }
                                ].map((g) => (
                                    <button
                                        key={g.id}
                                        type="button"
                                        onClick={() => setAvatarGender(g.id)}
                                        className={`py-1.5 px-1 text-center rounded-lg text-xs font-semibold transition-all ${
                                            avatarGender === g.id
                                                ? 'bg-white text-zinc-950 shadow-2xs font-bold'
                                                : 'text-zinc-600 hover:text-zinc-950'
                                        }`}
                                    >
                                        {g.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Các thanh trượt tinh chỉnh số đo */}
                        <div className="space-y-3 pt-1 text-xs">
                            {/* Chiều cao */}
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Chiều cao</span>
                                    <span className="font-bold text-zinc-900 font-mono">{height} cm (5'11")</span>
                                </div>
                                <input
                                    type="range"
                                    min="160"
                                    max="198"
                                    value={height}
                                    onChange={(e) => setHeight(Number(e.target.value))}
                                    className="w-full accent-[#f0592a] cursor-pointer"
                                />
                            </div>

                            {/* Vòng ngực */}
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Vòng ngực</span>
                                    <span className="font-bold text-zinc-900 font-mono">{chest} cm ({getChestSizeLabel(chest)})</span>
                                </div>
                                <input
                                    type="range"
                                    min="88"
                                    max="124"
                                    value={chest}
                                    onChange={(e) => setChest(Number(e.target.value))}
                                    className="w-full accent-[#f0592a] cursor-pointer"
                                />
                            </div>

                            {/* Rộng vai */}
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Độ rộng vai</span>
                                    <span className="font-bold text-zinc-900 font-mono">{shoulder} cm (Vai rộng)</span>
                                </div>
                                <input
                                    type="range"
                                    min="40"
                                    max="56"
                                    value={shoulder}
                                    onChange={(e) => setShoulder(Number(e.target.value))}
                                    className="w-full accent-[#f0592a] cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Bật/Tắt Bản đồ nhiệt độ căng áo */}
                        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                            <div className="space-y-0.5">
                                <span className="font-bold text-zinc-900 block">Bản đồ nhiệt độ căng vải</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                <input
                                    type="checkbox"
                                    checked={showHeatmap}
                                    onChange={(e) => setShowHeatmap(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f0592a]"></div>
                            </label>
                        </div>
                    </div>

                    {/* Bảng hạch toán giá thành & Lợi nhuận (Commercial Summary) */}
                    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-zinc-200/70 space-y-3">
                        <div className="flex items-center justify-between pb-1.5 border-b border-zinc-100">
                            <span className="text-[11px] font-bold uppercase text-zinc-400">Hạch toán chi phí</span>
                        </div>

                        <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between text-zinc-600">
                                <span>Phôi áo cotton 240 GSM:</span>
                                <span className="font-semibold text-zinc-900 font-mono">380.000 ₫</span>
                            </div>
                            <div className="flex justify-between text-zinc-600">
                                <span>Phí in DTF toàn mặt trước:</span>
                                <span className="font-semibold text-zinc-900 font-mono">60.000 ₫</span>
                            </div>
                            <div className="flex justify-between text-zinc-600">
                                <span>Phí nền tảng sáng tạo:</span>
                                <span className="font-semibold text-emerald-700 font-mono">Miễn phí</span>
                            </div>

                            <div className="pt-2 border-t border-zinc-100 flex items-baseline justify-between">
                                <span className="font-bold text-zinc-950">Giá thành xưởng cơ bản:</span>
                                <span className="text-base font-bold text-[#f0592a] font-mono">440.000 ₫</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full py-3 px-4 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] text-white font-bold text-xs shadow-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <span>Kiểm duyệt & Đăng bán sản phẩm</span>
                            <CheckCircle2 className="w-4 h-4" />
                        </button>
                    </div>

                </div>

            </div>

            {/* 3. FOOTER CAM KẾT VẬN HÀNH XƯỞNG MAY (4 TIÊU CHÍ BẢO CHỨNG) */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-zinc-200/70 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#faf8e4] text-[#f0592a] flex items-center justify-center shrink-0 border border-[#f0592a]/20">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-zinc-950">Xưởng in đạt chuẩn kiểm định</h4>
                        <p className="text-[11px] text-zinc-500">Tương thích với 14 trạm xưởng thủ công</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#faf8e4] text-[#f0592a] flex items-center justify-center shrink-0 border border-[#f0592a]/20">
                        <Maximize2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-zinc-950">Đa góc chụp độ tương phản cao</h4>
                        <p className="text-[11px] text-zinc-500">Xuất file hình ảnh độ phân giải 4K</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#faf8e4] text-[#f0592a] flex items-center justify-center shrink-0 border border-[#f0592a]/20">
                        <Leaf className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-zinc-950">Sản xuất On-Demand không tồn kho</h4>
                        <p className="text-[11px] text-zinc-500">Chỉ in may khi khách đặt thanh toán</p>
                    </div>
                </div>

                <div className="flex justify-start sm:justify-end">
                    <Link
                        to="/producers"
                        className="px-4 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-800 font-bold text-xs border border-zinc-200 shadow-2xs transition-all inline-flex items-center gap-1.5"
                    >
                        <span>Xem các xưởng đạt chuẩn</span>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                    </Link>
                </div>
            </div>

        </div>
    );
}