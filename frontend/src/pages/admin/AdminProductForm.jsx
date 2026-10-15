import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Check,
    FileEdit,
    Copy,
    Bold,
    Italic,
    List,
    Link2,
    ChevronDown,
    Image as ImageIcon,
    GripVertical,
    Trash2,
    UploadCloud,
    Palette,
    PlusCircle,
    ToggleRight,
    DollarSign,
    Loader2
} from 'lucide-react';

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', '2XL'];

export default function AdminProductForm() {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form states
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState(1);
    const [status, setStatus] = useState('ACTIVE');
    const [basePrice, setBasePrice] = useState('');

    // Hình ảnh
    const [images, setImages] = useState([]);

    // Ma trận size & tồn kho
    const [variants, setVariants] = useState(
        DEFAULT_SIZES.map(s => ({
            size: s,
            sku: `SKU-${s}`,
            stockQuantity: 0
        }))
    );

    // Tự sinh slug khi nhập tên (chỉ chạy ở chế độ Thêm mới)
    const handleNameChange = (val) => {
        setName(val);
        if (!isEditMode) {
            const generatedSlug = val
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[đĐ]/g, 'd')
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-');
            setSlug(generatedSlug);
        }
    };

    // 1. Tải dữ liệu khi ở chế độ Edit
    useEffect(() => {
        if (!isEditMode) {
            // Chế độ New: reset về trạng thái trống
            setName('');
            setSlug('');
            setDescription('');
            setBasePrice('');
            setStatus('ACTIVE');
            setImages([]);
            setVariants(
                DEFAULT_SIZES.map(s => ({
                    size: s,
                    sku: `SKU-${s}`,
                    stockQuantity: 0
                }))
            );
            return;
        }

        const fetchDetail = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`http://localhost:8080/api/v1/admin/products/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setName(data.name || '');
                    setSlug(data.slug || '');
                    setDescription(data.description || '');
                    setBasePrice(data.basePrice ? String(data.basePrice) : '');
                    setStatus(data.status || 'ACTIVE');
                    if (data.categoryId) setCategoryId(data.categoryId);

                    // Map danh sách ảnh từ DTO
                    if (data.images && data.images.length > 0) {
                        setImages(data.images.map((img, i) => ({
                            id: img.id || i,
                            url: img.imageUrl,              // DTO trả về imageUrl
                            title: `Ảnh ${i + 1}`,
                            isCover: img.isThumbnail        // DTO trả về isThumbnail
                        })));
                    }

                    // Map tồn kho từng size
                    if (data.variants && data.variants.length > 0) {
                        setVariants(prev => prev.map(row => {
                            // So sánh không phân biệt hoa thường và trim khoảng trắng
                            const found = data.variants.find(
                                v => String(v.size).trim().toUpperCase() === String(row.size).trim().toUpperCase()
                            );

                            if (found) {
                                // Lấy stockQuantity từ backend (hoặc stock nếu backend trả key là stock)
                                const qty = found.stockQuantity !== undefined ? found.stockQuantity : (found.stock ?? 0);
                                return {
                                    ...row,
                                    id: found.id || row.id,
                                    sku: found.sku || row.sku,
                                    stockQuantity: Number(qty)
                                };
                            }
                            return row;
                        }));
                    }
                }
            } catch (err) {
                console.error('Lỗi khi lấy chi tiết sản phẩm:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetail();
    }, [id, isEditMode]);

    // Thay đổi số lượng tồn kho theo từng Size
    const handleStockChange = (size, qty) => {
        const val = Math.max(0, parseInt(qty, 10) || 0);
        setVariants(prev => prev.map(v => v.size === size ? { ...v, stockQuantity: val } : v));
    };

    // 2. Xử lý Lưu sản phẩm (Submit Form)
    const handleSave = async () => {
        if (!name.trim()) {
            alert('Vui lòng nhập tên sản phẩm');
            return;
        }

        setIsSaving(true);
        const currentProductId = id || Date.now(); // Dùng id hiện tại hoặc timestamp nếu tạo mới

        const payload = {
            name: name.trim(),
            slug: slug.trim(),
            description: description.trim(),
            categoryId: categoryId ? Number(categoryId) : 1,
            basePrice: parseFloat(basePrice) || 0,
            status: status ? status.toUpperCase() : 'ACTIVE',
            imageUrls: images.map(img => img.url),
            variants: variants.map(v => {
                // Đảm bảo SKU luôn gắn liền với ID sản phẩm để không trùng nhau
                const uniqueSku = (v.sku && !v.sku.startsWith('SKU-'))
                    ? v.sku
                    : `PRD${currentProductId}-${v.size.toUpperCase()}`;

                return {
                    size: v.size,
                    sku: uniqueSku,
                    stockQuantity: Number(v.stockQuantity || 0)
                };
            })
        };

        try {
            const url = isEditMode
                ? `http://localhost:8080/api/v1/admin/products/${id}`
                : 'http://localhost:8080/api/v1/admin/products';
            const method = isEditMode ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                navigate('/admin/products');
            } else {
                const errText = await res.text();
                console.error('Server trả về lỗi:', res.status, errText);
                alert(`Lỗi ${res.status}: Không thể lưu sản phẩm. Vui lòng kiểm tra lại.`);
            }
        } catch (err) {
            console.error('Lỗi fetch:', err);
            alert('Lỗi kết nối máy chủ');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#f0592a]" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
            {/* 1. Header Điều hướng */}
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
                        <span className="font-semibold text-zinc-900 truncate max-w-xs md:max-w-md">
                            {isEditMode ? `Chỉnh sửa: ${name || 'Sản phẩm'}` : 'Thêm sản phẩm mới'}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/60">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950">
                            {isEditMode ? (name || 'Chỉnh sửa sản phẩm') : 'Thêm sản phẩm mới'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="h-10 px-5 rounded-xl bg-[#f0592a] hover:bg-[#d94a1f] disabled:opacity-50 text-white text-xs font-semibold shadow-xs active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            <span>{isEditMode ? 'Lưu thay đổi' : 'Tạo sản phẩm'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Bố cục Form (8 Cột Trái : 4 Cột Phải) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* CỘT TRÁI (8 Cột) */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Thông tin chung */}
                    <section className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                            <div className="w-8 h-8 rounded-lg bg-[#fefccf] text-[#f0592a] flex items-center justify-center">
                                <FileEdit className="w-4 h-4" />
                            </div>
                            <h2 className="text-base font-bold text-zinc-950">Thông tin chung</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                                    Tên sản phẩm <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="Ví dụ: Áo thun Vintage Washed Boxy Tee"
                                    className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#f0592a] font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                                    Đường dẫn định danh (Slug)
                                </label>
                                <div className="flex items-center rounded-xl bg-zinc-50 border border-zinc-200 px-3.5 h-11">
                                    <span className="text-xs text-zinc-400 select-none">atelier/products/</span>
                                    <input
                                        type="text"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="ao-thun-vintage-washed"
                                        className="w-full h-full bg-transparent text-xs text-zinc-900 pl-1 font-medium focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => navigator.clipboard.writeText(slug)}
                                        title="Sao chép slug"
                                        className="text-zinc-400 hover:text-[#f0592a] transition-colors pl-2"
                                    >
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
                                        <span className="text-[10px] text-zinc-400 font-medium px-1 ml-auto">Hỗ trợ Markdown</span>
                                    </div>
                                    <textarea
                                        rows={4}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Nhập thông tin chất liệu, phom dáng và hướng dẫn sử dụng..."
                                        className="w-full p-3.5 bg-transparent text-xs text-zinc-800 focus:outline-none resize-y leading-relaxed"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-800 mb-1.5">Danh mục</label>
                                <div className="relative">
                                    <select
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        className="w-full h-11 px-3.5 pr-8 appearance-none rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-[#f0592a] cursor-pointer"
                                    >
                                        <option value="1">Áo thun</option>
                                        <option value="2">Áo khoác</option>
                                        <option value="3">Phụ kiện</option>
                                    </select>
                                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Hình ảnh sản phẩm */}
                    <section className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <div>
                            <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-[#f0592a]" />
                                <span>Hình ảnh sản phẩm</span>
                            </h2>
                            <p className="text-xs text-zinc-500">Ảnh đại diện và các góc chụp chi tiết.</p>
                        </div>

                        {images.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {images.map((img, idx) => (
                                    <div key={idx} className="group relative rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 aspect-square flex flex-col justify-between">
                                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                                        {img.isCover && (
                                            <div className="absolute top-2 left-2">
                                                <span className="px-2 py-0.5 rounded-full bg-[#f0592a] text-white text-[9px] uppercase font-bold">
                                                    Ảnh bìa
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-xl p-6 text-center bg-[#faf8e4]/60 border-2 border-dashed border-[#f0592a]/30 flex flex-col items-center justify-center">
                                <UploadCloud className="w-6 h-6 text-[#f0592a] mb-2" />
                                <p className="text-xs font-bold text-zinc-900">Chưa có ảnh nào được tải lên</p>
                            </div>
                        )}
                    </section>

                    {/* Bảng kích cỡ & tồn kho */}
                    <section className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                            Quản lý tồn kho theo Size
                        </h3>

                        <div className="overflow-x-auto rounded-xl border border-zinc-200">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                <tr className="bg-[#faf8e4]/60 text-zinc-400 font-semibold text-[10px] uppercase border-b border-zinc-200">
                                    <th className="py-2.5 px-3">Kích cỡ</th>
                                    <th className="py-2.5 px-3">Mã SKU</th>
                                    <th className="py-2.5 px-3 text-right">Số lượng tồn kho</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                {variants.map((v) => (
                                    <tr key={v.size} className="hover:bg-zinc-50/70">
                                        <td className="py-2.5 px-3 font-bold text-zinc-900">
                                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-100 font-bold">
                                                    {v.size}
                                                </span>
                                        </td>
                                        <td className="py-2.5 px-3 font-mono text-zinc-600">{v.sku}</td>
                                        <td className="py-2.5 px-3 text-right">
                                            <input
                                                type="number"
                                                min="0"
                                                value={v.stockQuantity ?? 0}
                                                onChange={(e) => handleStockChange(v.size, e.target.value)}
                                                className="w-20 text-right h-8 px-2 rounded-lg bg-zinc-50 border border-zinc-200 font-mono font-bold text-zinc-900 focus:outline-none focus:border-[#f0592a]"
                                            />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* CỘT PHẢI (4 Cột) */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Trạng thái sản phẩm */}
                    <section className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                            <ToggleRight className="w-5 h-5 text-[#f0592a]" />
                            <h2 className="text-base font-bold text-zinc-950">Trạng thái mở bán</h2>
                        </div>

                        <div className="relative">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full h-11 px-3.5 pr-8 appearance-none rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-[#f0592a] cursor-pointer"
                            >
                                <option value="ACTIVE">Đang bán</option>
                                <option value="INACTIVE">Đang ẩn</option>
                                <option value="OUT_OF_STOCK">Hết hàng</option>
                            </select>
                            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                        </div>
                    </section>

                    {/* Giá bán */}
                    <section className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-[#f0592a]" />
                                <h2 className="text-base font-bold text-zinc-950">Giá bán niêm yết</h2>
                            </div>
                            <span className="text-[11px] font-mono font-bold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded">
                                VND (₫)
                            </span>
                        </div>
                        <input
                            type="number"
                            placeholder="Giá tiền sản phẩm"
                            value={basePrice}
                            onChange={(e) => setBasePrice(e.target.value)}
                            className="w-full h-11 px-3 rounded-xl bg-zinc-50 border border-zinc-200 text-sm font-mono font-bold text-[#f0592a] focus:outline-none focus:border-[#f0592a]"
                        />
                    </section>
                </div>
            </div>
        </div>
    );
}