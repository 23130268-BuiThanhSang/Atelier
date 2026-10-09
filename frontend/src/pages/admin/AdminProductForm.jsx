import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    RotateCcw,
    Check,
    FileEdit,
    Copy,
    Bold,
    Italic,
    List,
    Link2,
    ChevronDown,
    Image as ImageIcon,
    Sliders,
    GripVertical,
    Trash2,
    UploadCloud,
    Palette,
    PlusCircle,
    Ruler,
    Plus,
    ToggleRight,
    ExternalLink,
    DollarSign,
    Warehouse,
    CheckCircle2
} from 'lucide-react';

export default function AdminProductForm() {
    const { id } = useParams();
    const isEditMode = Boolean(id);

    // Form states cơ bản
    const [name, setName] = useState('Áo thun Vintage Washed Oversized Heavy Tee');
    const [slug, setSlug] = useState('ao-thun-vintage-washed-oversized-heavy-tee');
    const [description, setDescription] = useState(
        'Vải 100% cotton hữu cơ chải kỹ định lượng 280gsm xử lý giặt enzyme đá. Form áo dáng hộp rộng rãi (boxy drape) đã qua xử lý co rút, mang lại cảm giác thoải mái lâu dài chuẩn phong cách streetwear. Tương thích công nghệ in trực tiếp lên vải (DTG) và in lụa thủ công.'
    );
    const [category, setCategory] = useState('Áo thun đồ họa & Heavyweight');
    const [subcategory, setSubcategory] = useState('Dáng hộp Unisex (Boxy Cut)');
    const [status, setStatus] = useState('active');
    const [isFeatured, setIsFeatured] = useState(true);
    const [badgeTag, setBadgeTag] = useState('Artisan Pick · Bán chạy nhất');
    const [trackInventory, setTrackInventory] = useState(true);
    const [lowStockAlert, setLowStockAlert] = useState(20);
    const [binCode, setBinCode] = useState('SE-DIV-WH / Kệ 04-B');

    // Giá & Lợi nhuận
    const [basePrice, setBasePrice] = useState('380000');
    const [comparePrice, setComparePrice] = useState('480000');
    const [cogs, setCogs] = useState('142000');
    const [taxCategory, setTaxCategory] = useState('Hàng may mặc tiêu chuẩn (Chịu thuế)');

    // Bảng số đo size: đơn vị inches hoặc cm
    const [unit, setUnit] = useState('in'); // 'in' | 'cm'

    // DỮ LIỆU MẪU: Danh sách hình ảnh sản phẩm
    const [images, setImages] = useState([
        {
            id: 1,
            title: 'Góc chụp mặt trước',
            isCover: true,
            url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80',
        },
        {
            id: 2,
            title: 'Góc chụp mặt sau',
            url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=300&auto=format&fit=crop&q=80',
        },
        {
            id: 3,
            title: 'Cận cảnh đường may cổ áo',
            url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300&auto=format&fit=crop&q=80',
        },
        {
            id: 4,
            title: 'Mẫu bề mặt vải (Swatch)',
            url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=300&auto=format&fit=crop&q=80',
        },
    ]);

    // DỮ LIỆU MẪU: Bảng màu Swatches
    const colorways = [
        { name: 'Xám than chì (Charcoal Washed)', hex: '#2C2C2A' },
        { name: 'Yến mạch Vintage (Vintage Oat)', hex: '#E8E4D5' },
        { name: 'Rêu rừng (Forest Moss)', hex: '#3F4C3B' },
        { name: 'Đất nung (Terracotta Clay)', hex: '#C4623B' },
    ];

    // DỮ LIỆU MẪU: Ma trận tồn kho theo Size
    const sizeMatrix = [
        { size: 'S', sku: 'VWT-01-S-BLK', barcode: '8402910041', cogs: '142.000 ₫', stock: 45, status: 'Ổn định' },
        { size: 'M', sku: 'VWT-01-M-BLK', barcode: '8402910042', cogs: '142.000 ₫', stock: 120, status: 'Bán chạy' },
        { size: 'L', sku: 'VWT-01-L-BLK', barcode: '8402910043', cogs: '142.000 ₫', stock: 140, status: 'Bán chạy' },
        { size: 'XL', sku: 'VWT-01-XL-BLK', barcode: '8402910044', cogs: '142.000 ₫', stock: 85, status: 'Ổn định' },
        { size: '2XL', sku: 'VWT-01-2X-BLK', barcode: '8402910045', cogs: '142.000 ₫', stock: 30, status: 'Sắp hết hàng' },
    ];

    // DỮ LIỆU MẪU: Bảng thông số kích thước (Inches & CM)
    const sizeChartData = {
        in: [
            { size: 'S', chest: '21"', length: '28"', sleeve: '8.5"', fit: 'Vừa vặn thoải mái' },
            { size: 'M', chest: '23"', length: '29"', sleeve: '9.0"', fit: 'Dáng rủ boxy đặc trưng' },
            { size: 'L', chest: '25"', length: '30"', sleeve: '9.5"', fit: 'Form oversize chuẩn' },
            { size: 'XL', chest: '27"', length: '31"', sleeve: '10.0"', fit: 'Streetwear rộng rãi' },
            { size: '2XL', chest: '29"', length: '32"', sleeve: '10.5"', fit: 'Vai trễ cực thụng' },
        ],
        cm: [
            { size: 'S', chest: '53.3 cm', length: '71.1 cm', sleeve: '21.5 cm', fit: 'Vừa vặn thoải mái' },
            { size: 'M', chest: '58.4 cm', length: '73.6 cm', sleeve: '22.8 cm', fit: 'Dáng rủ boxy đặc trưng' },
            { size: 'L', chest: '63.5 cm', length: '76.2 cm', sleeve: '24.1 cm', fit: 'Form oversize chuẩn' },
            { size: 'XL', chest: '68.5 cm', length: '78.7 cm', sleeve: '25.4 cm', fit: 'Streetwear rộng rãi' },
            { size: '2XL', chest: '73.6 cm', length: '81.2 cm', sleeve: '26.6 cm', fit: 'Vai trễ cực thụng' },
        ],
    };

    const currentChart = sizeChartData[unit];

    // Tính biên lợi nhuận
    const marginAmount = parseFloat(basePrice || 0) - parseFloat(cogs || 0);
    const marginPct = (
        parseFloat(basePrice) > 0 ? (marginAmount / parseFloat(basePrice)) * 100 : 0
    ).toFixed(1);

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
            {/* 1. Tiêu đề trang & Điều hướng */}
            <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500 font-medium">
                    <div className="flex items-center gap-2">
                        <Link
                            to="/admin/products"
                            className="inline-flex items-center gap-1 font-semibold text-zinc-600 hover:text-[#f0592a] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Quay lại danh sách sản phẩm</span>
                        </Link>
                        <span className="text-zinc-300">/</span>
                        <span>Danh mục</span>
                        <span className="text-zinc-300">/</span>
                        <span className="font-semibold text-zinc-900 truncate max-w-xs md:max-w-md">
                            {isEditMode ? `Chỉnh sửa: ${name} (#PRD-7702)` : 'Thêm sản phẩm mới'}
                        </span>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase bg-emerald-50 text-emerald-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        Hiện tại: Đang bán
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/60">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950">{name}</h1>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                        <button
                            type="button"
                            className="h-10 px-4 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 shadow-xs flex items-center gap-1.5 transition-colors"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Hủy thay đổi</span>
                        </button>
                        <button
                            type="button"
                            className="h-10 px-5 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] text-white text-xs font-semibold shadow-xs active:scale-[0.98] transition-all flex items-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            <span>Lưu sản phẩm</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Bố cục 2 Cột (8 Cột Trái : 4 Cột Phải) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* CỘT TRÁI (8 Cột) */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Khối 1: Thông tin chung */}
                    <section className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-[#fefccf] text-[#f0592a] flex items-center justify-center">
                                    <FileEdit className="w-4 h-4" />
                                </div>
                                <h2 className="text-base font-bold text-zinc-950">Thông tin chung</h2>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                                    Tên sản phẩm <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#f0592a] focus:ring-2 focus:ring-[#f0592a]/20 transition-all font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                                    Đường dẫn định danh (Slug / Canonical URL)
                                </label>
                                <div className="flex items-center rounded-xl bg-zinc-50 border border-zinc-200 px-3.5 h-11">
                                    <span className="text-xs text-zinc-400 select-none">atelier.style/shop/</span>
                                    <input
                                        type="text"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        className="w-full h-full bg-transparent text-xs text-zinc-900 pl-1 font-medium focus:outline-none"
                                    />
                                    <button type="button" title="Sao chép slug" className="text-zinc-400 hover:text-[#f0592a] transition-colors pl-2">
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                                    Mô tả chi tiết <span className="text-red-500">*</span>
                                </label>
                                <div className="rounded-xl border border-zinc-200 overflow-hidden bg-zinc-50">
                                    <div className="flex items-center gap-1 p-2 bg-zinc-100/70 border-b border-zinc-200/70 text-zinc-700">
                                        <button type="button" className="p-1.5 rounded hover:bg-white text-xs font-bold" title="In đậm">
                                            <Bold className="w-3.5 h-3.5" />
                                        </button>
                                        <button type="button" className="p-1.5 rounded hover:bg-white text-xs italic" title="In nghiêng">
                                            <Italic className="w-3.5 h-3.5" />
                                        </button>
                                        <div className="w-px h-4 bg-zinc-300 mx-1"></div>
                                        <button type="button" className="p-1.5 rounded hover:bg-white text-xs" title="Danh sách">
                                            <List className="w-3.5 h-3.5" />
                                        </button>
                                        <button type="button" className="p-1.5 rounded hover:bg-white text-xs" title="Chèn liên kết">
                                            <Link2 className="w-3.5 h-3.5" />
                                        </button>
                                        <div className="w-px h-4 bg-zinc-300 mx-1"></div>
                                        <span className="text-[10px] text-zinc-400 font-medium px-1">Hỗ trợ Markdown & HTML</span>
                                    </div>
                                    <textarea
                                        rows={4}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full p-3.5 bg-transparent text-xs text-zinc-800 focus:outline-none resize-y leading-relaxed"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-800 mb-1.5">Danh mục chính</label>
                                    <div className="relative">
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full h-11 px-3.5 pr-8 appearance-none rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-[#f0592a] cursor-pointer"
                                        >
                                            <option>Áo thun đồ họa & Heavyweight</option>
                                            <option>Áo hoodie thủ công & Nỉ bông</option>
                                            <option>Phụ kiện vải bố Canvas mộc</option>
                                            <option>Áo khoác sơ mi & Outerwear</option>
                                        </select>
                                        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-800 mb-1.5">Kiểu dáng / Phom cắt (Silhouette)</label>
                                    <div className="relative">
                                        <select
                                            value={subcategory}
                                            onChange={(e) => setSubcategory(e.target.value)}
                                            className="w-full h-11 px-3.5 pr-8 appearance-none rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-[#f0592a] cursor-pointer"
                                        >
                                            <option>Dáng hộp Unisex (Boxy Cut)</option>
                                            <option>Dáng vai trễ Vintage (Drop-Shoulder)</option>
                                            <option>Form suông tiêu chuẩn (Tailored Slub)</option>
                                            <option>Form lửng dáng hộp (Cropped Boxy Fit)</option>
                                        </select>
                                        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Khối 2: Hình ảnh sản phẩm */}
                    <section className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                            <div>
                                <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4 text-[#f0592a]" />
                                    <span>Hình ảnh sản phẩm & Các góc chụp</span>
                                </h2>
                                <p className="text-xs text-zinc-500">Tải lên ít nhất 3 góc chụp chất lượng cao (Mặt trước, Mặt sau, Cận cảnh đường chỉ, Mặc trên người mẫu).</p>
                            </div>
                            <button type="button" className="text-xs font-semibold text-[#f0592a] flex items-center gap-1 hover:underline">
                                <Sliders className="w-3.5 h-3.5" />
                                <span>Quy chuẩn hình ảnh</span>
                            </button>
                        </div>

                        {/* Lưới xem trước ảnh */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {images.map((img) => (
                                <div key={img.id} className="group relative rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200/80 aspect-square flex flex-col justify-between">
                                    <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                                    {img.isCover && (
                                        <div className="absolute top-2 left-2">
                                            <span className="px-2 py-0.5 rounded-full bg-[#f0592a] text-white text-[9px] uppercase font-bold tracking-wider shadow-xs">
                                                Ảnh bìa
                                            </span>
                                        </div>
                                    )}

                                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white z-10">
                                        <span className="text-[10px] font-medium truncate">{img.title}</span>
                                        <div className="flex items-center gap-1">
                                            <button type="button" title="Sắp xếp" className="p-1 rounded bg-black/40 hover:bg-black/70 text-white transition-colors">
                                                <GripVertical className="w-3 h-3" />
                                            </button>
                                            <button type="button" title="Xóa ảnh" className="p-1 rounded bg-black/40 hover:bg-red-600 text-white transition-colors">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Vùng kéo thả file */}
                        <div className="rounded-xl p-6 text-center bg-[#faf8e4]/60 border-2 border-dashed border-[#f0592a]/30 hover:bg-[#faf8e4] transition-all flex flex-col items-center justify-center cursor-pointer group">
                            <div className="w-12 h-12 rounded-full bg-[#fefccf] flex items-center justify-center text-[#f0592a] group-hover:scale-110 group-hover:bg-[#f0592a] group-hover:text-white transition-all mb-2">
                                <UploadCloud className="w-6 h-6" />
                            </div>
                            <p className="text-xs font-bold text-zinc-900">
                                Kéo và thả file ảnh vào đây, hoặc <span className="text-[#f0592a] underline">duyệt tìm file</span>
                            </p>
                            <span className="text-[11px] text-zinc-400 mt-0.5">
                                Hỗ trợ PNG, JPG, WEBP tối đa 20MB/file (Khuyến nghị 1600×2000px)
                            </span>
                        </div>
                    </section>

                    {/* Khối 3: Bảng phối màu & Ma trận Size */}
                    <section className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-5">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div>
                                <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                                    <Palette className="w-4 h-4 text-[#f0592a]" />
                                    <span>Bảng màu nhuộm có sẵn</span>
                                </h2>
                            </div>
                            <span className="text-[10px] font-bold uppercase bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-full">
                                4 Tông màu nhuộm
                            </span>
                        </div>

                        {/* Danh sách Swatches màu */}
                        <div className="flex flex-wrap items-center gap-2.5">
                            {colorways.map((c, i) => (
                                <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200/80 shadow-2xs">
                                    <div className="w-6 h-6 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: c.hex }} />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold text-zinc-900">{c.name}</span>
                                        <span className="text-[10px] text-zinc-400 font-mono">{c.hex}</span>
                                    </div>
                                    <span className="text-[9px] font-bold uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full ml-1">
                                        Đang dùng
                                    </span>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="h-10 px-3.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-[#f0592a] flex items-center gap-1.5 transition-colors"
                            >
                                <PlusCircle className="w-4 h-4" />
                                <span>Thêm mẫu màu</span>
                            </button>
                        </div>

                        {/* Ma trận Size & SKU */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Bảng kích cỡ & Tồn kho</h3>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-zinc-200">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                    <tr className="bg-[#faf8e4]/60 text-zinc-400 font-semibold text-[10px] uppercase border-b border-zinc-200/70">
                                        <th className="py-2.5 px-3">Kích cỡ</th>
                                        <th className="py-2.5 px-3">Mã vạch (UPC)</th>
                                        <th className="py-2.5 px-3 text-right">Giá vốn đơn vị</th>
                                        <th className="py-2.5 px-3 text-right">Số lượng tồn</th>
                                        <th className="py-2.5 px-3 text-center">Trạng thái</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100">
                                    {sizeMatrix.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-zinc-50/70 transition-colors">
                                            <td className="py-2.5 px-3 font-bold text-zinc-900">
                                                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-100 font-bold">
                                                        {item.size}
                                                    </span>
                                            </td>
                                            <td className="py-2.5 px-3 font-mono text-zinc-600">{item.sku}</td>
                                            <td className="py-2.5 px-3 font-mono text-zinc-400">{item.barcode}</td>
                                            <td className="py-2.5 px-3 text-right font-mono text-zinc-800">{item.cogs}</td>
                                            <td className="py-2.5 px-3 text-right">
                                                <input
                                                    type="number"
                                                    defaultValue={item.stock}
                                                    className="w-16 text-right h-7 px-2 rounded-lg bg-zinc-50 border border-zinc-200 font-mono font-bold text-zinc-900 focus:outline-none focus:border-[#f0592a]"
                                                />
                                            </td>
                                            <td className="py-2.5 px-3 text-center">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                        item.status === 'Sắp hết hàng' ? 'bg-amber-50 text-amber-800' : 'text-emerald-700 bg-emerald-50'
                                                    }`}>
                                                        {item.status}
                                                    </span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Khối 4: Bảng thông số kích thước (Size Chart) */}
                    <section className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                            <div>
                                <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                                    <Ruler className="w-4 h-4 text-[#f0592a]" />
                                    <span>Bảng thông số kích thước chuẩn</span>
                                </h2>
                                <p className="text-xs text-zinc-500">Số đo may mặc chuẩn hóa hiển thị ngoài trang sản phẩm cho khách hàng</p>
                            </div>

                            {/* Chuyển đổi đơn vị Inches / Centimeters */}
                            <div className="inline-flex p-1 rounded-xl bg-zinc-100 border border-zinc-200/80">
                                <button
                                    type="button"
                                    onClick={() => setUnit('in')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                                        unit === 'in' ? 'bg-white text-[#f0592a] shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                                    }`}
                                >
                                    Inches
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUnit('cm')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                                        unit === 'cm' ? 'bg-white text-[#f0592a] shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                                    }`}
                                >
                                    Centimet
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-zinc-200">
                            <table className="w-full text-left text-xs border-collapse font-mono">
                                <thead>
                                <tr className="bg-[#faf8e4]/60 text-zinc-400 font-semibold text-[10px] uppercase font-sans border-b border-zinc-200/70">
                                    <th className="py-2.5 px-3">Kích cỡ</th>
                                    <th className="py-2.5 px-3">Rộng ngực</th>
                                    <th className="py-2.5 px-3">Dài áo</th>
                                    <th className="py-2.5 px-3">Dài tay</th>
                                    <th className="py-2.5 px-3 font-sans">Gợi ý phom mặc</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                {currentChart.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-zinc-50/70 transition-colors">
                                        <td className="py-2.5 px-3 font-bold text-zinc-900 font-sans">{row.size}</td>
                                        <td className="py-2.5 px-3 text-zinc-800">{row.chest}</td>
                                        <td className="py-2.5 px-3 text-zinc-800">{row.length}</td>
                                        <td className="py-2.5 px-3 text-zinc-800">{row.sleeve}</td>
                                        <td className="py-2.5 px-3 text-zinc-500 font-sans">{row.fit}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
                            <button type="button" className="text-[#f0592a] font-semibold hover:underline flex items-center gap-1">
                                <Plus className="w-4 h-4" />
                                <span>Thêm hàng số đo</span>
                            </button>
                        </div>
                    </section>

                </div>

                {/* CỘT PHẢI (4 Cột) */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Khối 1: Trạng thái & Xuất bản */}
                    <section className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                            <ToggleRight className="w-5 h-5 text-[#f0592a]" />
                            <h2 className="text-base font-bold text-zinc-950">Trạng thái & Xuất bản</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-800 mb-1.5">Trạng thái sản phẩm</label>
                                <div className="relative">
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full h-11 px-3.5 pr-8 appearance-none rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-[#f0592a] cursor-pointer"
                                    >
                                        <option value="active">Đang bán · Hiển thị trên cửa hàng</option>
                                        <option value="hidden">Đang ẩn / Bản nháp</option>
                                        <option value="out_of_stock">Hết hàng</option>
                                        <option value="archived">Lưu trữ</option>
                                    </select>
                                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Công tắc Sản phẩm nổi bật */}
                            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start justify-between gap-3">
                                <div className="space-y-0.5">
                                    <span className="text-xs font-bold text-zinc-900 block">Sản phẩm nổi bật</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                                    <input
                                        type="checkbox"
                                        checked={isFeatured}
                                        onChange={(e) => setIsFeatured(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f0592a]"></div>
                                </label>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-800 mb-1.5">Thẻ nhãn mặt tiền cửa hàng</label>
                                <input
                                    type="text"
                                    value={badgeTag}
                                    onChange={(e) => setBadgeTag(e.target.value)}
                                    className="w-full h-11 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#f0592a]"
                                />
                            </div>

                            {/* Thông tin Xưởng sản xuất gán kèm */}
                            <div className="p-3.5 rounded-xl bg-[#faf8e4]/60 border border-[#f0592a]/20 space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Xưởng / Nhà sản xuất</span>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-[#fefccf] text-[#f0592a] font-bold text-xs flex items-center justify-center border border-[#f0592a]/20">
                                            SN
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-zinc-900">Studio Nord Artisan Wear</span>
                                            <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-0.5">
                                                <CheckCircle2 className="w-3 h-3" /> Xưởng đạt chứng nhận
                                            </span>
                                        </div>
                                    </div>
                                    <Link
                                        to="/admin/users/USR-8492"
                                        title="Xem hồ sơ xưởng"
                                        className="p-1.5 rounded-lg hover:bg-zinc-200 text-zinc-500 hover:text-[#f0592a] transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Khối 2: Định giá & Biên lợi nhuận */}
                    <section className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-[#f0592a]" />
                                <h2 className="text-base font-bold text-zinc-950">Định giá & Biên lợi nhuận</h2>
                            </div>
                            <span className="text-[11px] font-mono font-bold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded">
                                VND (₫)
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-800 mb-1.5">Giá bán lẻ</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={basePrice}
                                            onChange={(e) => setBasePrice(e.target.value)}
                                            className="w-full h-11 px-3 rounded-xl bg-zinc-50 border border-zinc-200 text-sm font-mono font-bold text-[#f0592a] focus:outline-none focus:border-[#f0592a]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-800 mb-1.5">Giá gốc so sánh</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={comparePrice}
                                            onChange={(e) => setComparePrice(e.target.value)}
                                            className="w-full h-11 px-3 rounded-xl bg-zinc-50 border border-zinc-200 text-sm font-mono text-zinc-400 line-through focus:outline-none focus:border-[#f0592a]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-800 mb-1.5">Giá vốn mỗi chiếc (Giá xưởng sản xuất - COGS)</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={cogs}
                                        onChange={(e) => setCogs(e.target.value)}
                                        className="w-full h-11 px-3 rounded-xl bg-zinc-50 border border-zinc-200 text-sm font-mono text-zinc-800 focus:outline-none focus:border-[#f0592a]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-800 mb-1.5">Danh mục thuế</label>
                                <div className="relative">
                                    <select
                                        value={taxCategory}
                                        onChange={(e) => setTaxCategory(e.target.value)}
                                        className="w-full h-11 px-3.5 pr-8 appearance-none rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-[#f0592a] cursor-pointer"
                                    >
                                        <option>Hàng may mặc tiêu chuẩn (Chịu thuế)</option>
                                        <option>Miễn thuế / Mẫu sản phẩm thử nghiệm</option>
                                        <option>Thuế suất đặc biệt (Hàng xuất khẩu)</option>
                                    </select>
                                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Khối 3: Quản lý tồn kho */}
                    <section className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                            <Warehouse className="w-5 h-5 text-[#f0592a]" />
                            <h2 className="text-base font-bold text-zinc-950">Quản lý tồn kho</h2>
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={trackInventory}
                                    onChange={(e) => setTrackInventory(e.target.checked)}
                                    className="w-4 h-4 rounded text-[#f0592a] accent-[#f0592a] cursor-pointer"
                                />
                                <span className="text-xs font-bold text-zinc-900">Theo dõi số lượng tồn kho cho sản phẩm này</span>
                            </label>

                            <div>
                                <label className="block text-xs font-bold text-zinc-800 mb-1.5">Ngưỡng cảnh báo sắp hết hàng</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={lowStockAlert}
                                        onChange={(e) => setLowStockAlert(e.target.value)}
                                        className="w-full h-11 px-3.5 pr-14 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-mono font-bold text-zinc-900 focus:outline-none focus:border-[#f0592a]"
                                    />
                                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400">chiếc</span>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}