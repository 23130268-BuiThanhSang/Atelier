import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Check,
    FileEdit,
    Copy,
    Bold,
    Italic,
    List,
    ChevronDown,
    Image as ImageIcon,
    Trash2,
    UploadCloud,
    ToggleRight,
    DollarSign,
    Loader2,
    Plus,
    Star
} from 'lucide-react';

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', '2XL'];

export default function AdminProductForm() {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // Form states
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState(1);
    const [status, setStatus] = useState('ACTIVE');
    const [basePrice, setBasePrice] = useState('');

    // Danh sách hình ảnh: [{ id, url, isCover }]
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
                            id: img.id || `img-${Date.now()}-${i}`,
                            url: img.imageUrl || img.url,
                            title: `Ảnh ${i + 1}`,
                            isCover: img.isThumbnail ?? (i === 0)
                        })));
                    }

                    // Map tồn kho từng size
                    if (data.variants && data.variants.length > 0) {
                        setVariants(prev => prev.map(row => {
                            const found = data.variants.find(
                                v => String(v.size).trim().toUpperCase() === String(row.size).trim().toUpperCase()
                            );

                            if (found) {
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

    // Xử lý chọn file ảnh từ máy tính & tải lên Cloudinary
    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setIsUploadingImage(true);

        // Đọc từng file sang Base64
        const readFileAsBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = (err) => reject(err);
                reader.readAsDataURL(file);
            });
        };

        try {
            const uploadedUrls = [];

            for (const file of files) {
                const base64Data = await readFileAsBase64(file);

                // Gửi request upload lên backend Cloudinary
                const res = await fetch('http://localhost:8080/api/v1/admin/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64Data })
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.url) {
                        uploadedUrls.push(data.url);
                    }
                } else {
                    // Dự phòng nếu endpoint riêng chưa bật: tạm lưu dạng Base64 để backend xử lý lúc lưu
                    uploadedUrls.push(base64Data);
                }
            }

            if (uploadedUrls.length > 0) {
                setImages((prev) => {
                    const newImages = uploadedUrls.map((url, idx) => ({
                        id: `uploaded-${Date.now()}-${idx}`,
                        url: url,
                        isCover: prev.length === 0 && idx === 0 // Nếu danh sách đang trống thì ảnh đầu tiên làm bìa
                    }));
                    return [...prev, ...newImages];
                });
            }
        } catch (err) {
            console.error('Lỗi khi upload ảnh:', err);
            alert('Có lỗi xảy ra khi tải ảnh lên Cloudinary.');
        } finally {
            setIsUploadingImage(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Đặt 1 ảnh làm ảnh bìa
    const handleSetCover = (targetId) => {
        setImages(prev => prev.map(img => ({
            ...img,
            isCover: img.id === targetId
        })));
    };

    // Xóa ảnh khỏi danh sách
    const handleRemoveImage = (targetId) => {
        setImages(prev => {
            const filtered = prev.filter(img => img.id !== targetId);
            // Nếu ảnh bị xóa là ảnh bìa, tự động gán ảnh đầu tiên còn lại làm bìa
            if (filtered.length > 0 && !filtered.some(img => img.isCover)) {
                filtered[0].isCover = true;
            }
            return filtered;
        });
    };

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
        const currentProductId = id || Date.now();

        // Đảm bảo ảnh bìa được sắp xếp lên đầu danh sách
        const sortedImages = [...images].sort((a, b) => (b.isCover ? 1 : 0) - (a.isCover ? 1 : 0));

        const payload = {
            name: name.trim(),
            slug: slug.trim(),
            description: description.trim(),
            categoryId: categoryId ? Number(categoryId) : 1,
            basePrice: parseFloat(basePrice) || 0,
            status: status ? status.toUpperCase() : 'ACTIVE',
            imageUrls: sortedImages.map(img => img.url),
            variants: variants.map(v => {
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
            {/* Input file ẩn dùng chung */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
            />

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

                    {/* Hình ảnh sản phẩm (Đã hoàn thiện thêm ảnh, đặt ảnh bìa, xóa ảnh) */}
                    <section className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                            <div>
                                <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4 text-[#f0592a]" />
                                    <span>Hình ảnh sản phẩm ({images.length})</span>
                                </h2>
                                <p className="text-xs text-zinc-500">Ảnh đầu tiên hoặc ảnh được gắn sao là ảnh bìa.</p>
                            </div>

                            <button
                                type="button"
                                disabled={isUploadingImage}
                                onClick={() => fileInputRef.current?.click()}
                                className="px-3.5 py-2 bg-[#fefccf] hover:bg-[#faee9c] text-[#f0592a] border border-[#f0592a]/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
                            >
                                {isUploadingImage ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Đang tải lên...</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        <span>Tải thêm ảnh</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {images.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {images.map((img) => (
                                    <div
                                        key={img.id}
                                        className="group relative rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 aspect-square flex flex-col justify-between"
                                    >
                                        <img src={img.url} alt="" className="w-full h-full object-cover" />

                                        {/* Tag ảnh bìa */}
                                        {img.isCover && (
                                            <div className="absolute top-2 left-2 z-10">
                                                <span className="px-2 py-0.5 rounded-full bg-[#f0592a] text-white text-[9px] uppercase font-bold shadow-2xs flex items-center gap-1">
                                                    <Star className="w-2.5 h-2.5 fill-current" />
                                                    Ảnh bìa
                                                </span>
                                            </div>
                                        )}

                                        {/* Thanh tác vụ khi hover */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                                            {!img.isCover && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleSetCover(img.id)}
                                                    title="Đặt làm ảnh bìa"
                                                    className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-zinc-800 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                                                >
                                                    <Star className="w-4 h-4 text-amber-500" />
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(img.id)}
                                                title="Xóa ảnh này"
                                                className="w-8 h-8 rounded-lg bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Ô bấm thêm ảnh nhanh */}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="rounded-xl border-2 border-dashed border-zinc-200 hover:border-[#f0592a] bg-zinc-50/50 hover:bg-[#faf8e4]/40 aspect-square flex flex-col items-center justify-center text-zinc-400 hover:text-[#f0592a] transition-all cursor-pointer"
                                >
                                    <Plus className="w-6 h-6 mb-1" />
                                    <span className="text-[11px] font-bold">Thêm ảnh</span>
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="rounded-xl p-8 text-center bg-[#faf8e4]/60 border-2 border-dashed border-[#f0592a]/30 flex flex-col items-center justify-center cursor-pointer hover:bg-[#faf8e4] transition-colors"
                            >
                                <UploadCloud className="w-8 h-8 text-[#f0592a] mb-2" />
                                <p className="text-xs font-bold text-zinc-900">Bấm vào đây để tải ảnh lên</p>
                                <p className="text-[10px] text-zinc-500 mt-1">Hỗ trợ định dạng PNG, JPG, WEBP (chọn nhiều ảnh cùng lúc)</p>
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