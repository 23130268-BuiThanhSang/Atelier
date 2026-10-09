import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ChevronRight,
    Shield,
    Tag,
    Lock,
    ShieldCheck,
    Clock,
    Layers,
    Receipt,
    Package,
    Sparkles,
    Handshake,
    Check,
    Zap,
    FastForward,
    Gavel,
    ChevronDown,
    UploadCloud,
    FileText,
    Image as ImageIcon,
    X,
    LockKeyhole,
    Info,
    MessageSquare
} from 'lucide-react';

export default function OrderResolutionCenter() {
    const { id } = useParams();
    const orderId = id || '#TS-98821';

    const [isDisputeOpen, setIsDisputeOpen] = useState(false);
    const [disputeCategory, setDisputeCategory] = useState('Work Already Incurred / Custom Blanks Cut');
    const [claimedAmount, setClaimedAmount] = useState('165.00');
    const [disputeMemo, setDisputeMemo] = useState(
        'Chúng tôi đã tiếp nhận, kiểm định chất lượng và bóc niêm phong 40 áo phôi cotton hữu cơ chải kỹ định lượng 240 GSM nhập riêng cho đơn vị Studio Berlin Merch. Hơn nữa, toàn bộ 4 bản phim lưới trame in lụa đã được phơi và đăng ký khuôn vào chiều hôm qua (Mã lô #ST-2940). Việc đưa số vải phôi này về kho thông thường sẽ gây hao mòn nguyên liệu. Chúng tôi yêu cầu khoản bồi hoàn 165.00 USD bao gồm chi phí vật tư ($120) và công chuẩn bị kỹ thuật ($45) theo đúng Mục 8.4 Quy chuẩn Hiệp hội Nghệ nhân Atelier.'
    );

    const [attachedFiles, setAttachedFiles] = useState([
        { name: 'anh_phoi_khung_in_batch_2940.jpg', size: '2.4 MB', type: 'image' },
        { name: 'hoa_don_nhap_phoi_nordic240.pdf', size: '640 KB', type: 'doc' },
    ]);

    // Quản lý Toast thông báo
    const [toast, setToast] = useState({
        show: false,
        title: '',
        message: '',
        type: 'success',
    });

    const showNotification = (title, message, type = 'success') => {
        setToast({ show: true, title, message, type });
        setTimeout(() => {
            setToast((prev) => ({ ...prev, show: false }));
        }, 5000);
    };

    const handleAcceptSettlement = () => {
        showNotification(
            'Đã chấp nhận phương án hòa giải',
            'Bạn đã đồng ý hủy đơn với khoản bù đắp vật tư 165.00 USD. Lệnh giải ngân ký quỹ đã được chuyển đến cả 2 bên.',
            'success'
        );
    };

    const handleOfferExpedited = () => {
        showNotification(
            'Đã gửi đề xuất giao hỏa tốc',
            'Phương án đẩy tiến độ (Giao ngày 20/10) đã được chuyển đến Studio Berlin Merch để ký xác nhận điện tử.',
            'info'
        );
    };

    const handleDisputeSubmit = (e) => {
        e.preventDefault();
        showNotification(
            'Đã chuyển khiếu nại lên Hội đồng Trọng tài',
            'Hồ sơ ARB-0882-NL đã được chuyển cho Trọng tài viên cấp cao Kenjiro M. Phán quyết ràng buộc sẽ có trong vòng 24 giờ.',
            'danger'
        );
        setIsDisputeOpen(false);
    };

    const handleRemoveFile = (indexToRemove) => {
        setAttachedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    };

    return (
        <div className="w-full bg-[#fefccf] min-h-screen py-6 px-4 sm:px-8 xl:px-12 space-y-6">
            {/* 1. Thanh điều hướng & Tiêu đề ngữ cảnh */}
            <div className="space-y-3 border-b border-zinc-200/60 pb-5">
                <nav className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium flex-wrap">
                    <Link to="/my-orders" className="hover:text-zinc-900 transition-colors">Tài khoản</Link>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-zinc-700">Đơn hàng {orderId}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-zinc-950 font-bold">Trung tâm giải quyết khiếu nại</span>
                </nav>

                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950">
                        Trung tâm giải quyết đơn hàng
                    </h1>
                </div>
            </div>

            {/* 2. Banner cam kết an toàn ký quỹ (Stitch SafePay) */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-zinc-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#fefccf] text-[#f0592a] border border-[#f0592a]/20 flex items-center justify-center shrink-0 shadow-2xs">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                        <h2 className="text-sm md:text-base font-bold text-zinc-950">
                            Giao thức hòa giải ký quỹ an toàn Atelier SafePay
                        </h2>
                        <p className="text-xs text-zinc-600 leading-relaxed">
                            Toàn bộ số tiền thanh toán vẫn được khóa an toàn trong quỹ ký quỹ trung gian của hiệp hội trong khi hai bên thương thảo, đối soát chi phí vật tư hoặc gửi bằng chứng phân xử. Không bên nào có quyền đơn phương rút tiền.
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. Bố cục 2 cột chính: Chi tiết & Phương án (8 Cột) + Sổ cái & Trọng tài viên (4 Cột) */}
            <div className="w-full flex flex-col xl:flex-row gap-6 items-start">

                {/* CỘT CHÍNH (Chiếm toàn bộ không gian bên trái) */}
                <div className="w-full xl:flex-1 space-y-6 min-w-0">

                    {/* Khối Thông tin chi tiết trường hợp yêu cầu hủy */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/70 space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#fefccf] text-[#f0592a] font-bold text-sm border border-[#f0592a]/20 flex items-center justify-center shrink-0">
                                    SB
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-zinc-950">Studio Berlin Merch</span>
                                    </div>
                                </div>
                            </div>

                            <span className="text-xs text-zinc-500 flex items-center gap-1.5 shrink-0">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                Gửi yêu cầu 4 giờ trước (14/10, 09:42 CET)
              </span>
                        </div>

                        {/* Tóm tắt đơn hàng nhanh */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-zinc-50 p-4 rounded-xl border border-zinc-200/60 text-xs">
                            <div className="space-y-0.5">
                                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Dòng sản phẩm</span>
                                <span className="font-bold text-zinc-900 block">Áo thun Nordic Minimalist (40 chiếc)</span>
                                <span className="text-zinc-500 text-[11px]">Cotton hữu cơ chải thô 240 GSM</span>
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Xưởng may phụ trách</span>
                                <span className="font-bold text-zinc-900 block">Xưởng Kanto Craft Atelier</span>
                                <span className="text-zinc-500 text-[11px]">Trạm xưởng Kyoto / Berlin</span>
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Giai đoạn sản xuất</span>
                                <span className="inline-flex items-center gap-1 text-amber-800 font-bold">
                  <Layers className="w-3.5 h-3.5" /> Bước 2: Đã mở niêm phong phôi
                </span>
                                <span className="text-zinc-500 text-[11px] block">Đã tách bản phim & phơi khung lưới</span>
                            </div>
                        </div>

                        {/* Lý do & Bản ghi nhớ của khách */}
                        <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                                <span className="font-bold uppercase tracking-wider text-zinc-400">Lý do hủy đơn lựa chọn:</span>
                            </div>

                            <div className="bg-[#faf8e4]/60 p-4 rounded-xl border border-zinc-200/70 space-y-1.5 relative">
                                <span className="text-[11px] font-bold text-zinc-500 block uppercase tracking-wider">Bản ghi nhớ đính kèm từ khách hàng:</span>
                                <p className="text-xs text-zinc-800 italic leading-relaxed">
                                    “Sự kiện showcase âm nhạc của chúng tôi tại Hamburg vừa bị ban tổ chức đẩy sớm lên 10 ngày. Chúng tôi bắt buộc phải nhận được hàng tại sân khấu trước ngày 20/10 thay vì ngày 30/10 như hợp đồng ban đầu. Chúng tôi hiểu việc này đi trước tiến độ sản xuất thông thường, nên nếu xưởng không thể tăng tốc kịp thời, chúng tôi xin phép được hủy đơn và thanh toán sòng phẳng các chi phí chuẩn bị ban đầu hợp lý cho xưởng.”
                                </p>
                            </div>
                        </div>

                        {/* Chi phí xưởng đã bỏ ra */}
                        <div className="border-t border-zinc-100 pt-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Receipt className="w-4 h-4 text-[#f0592a]" />
                                    <h3 className="text-sm font-bold text-zinc-950">Chi phí vật tư & Công chuẩn bị đã phát sinh</h3>
                                </div>
                                <span className="text-base font-bold text-[#f0592a]">165.00 USD</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200/70 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <Package className="w-4 h-4 text-zinc-500" />
                                        <div>
                                            <span className="text-xs font-bold text-zinc-900 block">Phôi vải đã bóc niêm phong</span>
                                            <span className="text-[11px] text-zinc-400">40 áo phôi cotton hữu cơ đã giặt xử lý co</span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-zinc-950">120.00 USD</span>
                                </div>

                                <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200/70 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <Sparkles className="w-4 h-4 text-zinc-500" />
                                        <div>
                                            <span className="text-xs font-bold text-zinc-900 block">Công thợ tách màu & Phơi khung</span>
                                            <span className="text-[11px] text-zinc-400">4 bản khung in lụa trame đã phơi keo</span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-zinc-950">45.00 USD</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Khối 2 Phương án phản hồi dành cho xưởng (Side-by-Side Cards) */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-zinc-950">
                                Lựa chọn phương án phản hồi của xưởng
                            </h2>
                            <span className="text-xs text-zinc-500">Hạn phản hồi trước ngày 16/10 (Còn lại 44 giờ)</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Phương án A: Đồng ý hủy có bồi hoàn */}
                            <div className="bg-white rounded-2xl p-5 shadow-xs border border-zinc-200/70 flex flex-col justify-between hover:shadow-md transition-shadow space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      <Handshake className="w-3.5 h-3.5" /> SẴN SÀNG THỎA HIỆP HÒA GIẢI
                    </span>
                                        <span className="text-xs font-mono font-bold text-zinc-400">HƯỚNG A</span>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-zinc-950">
                                            Chấp nhận hủy đơn & Nhận phí vật tư
                                        </h3>
                                        <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                                            Đồng ý dừng in lô hàng. Xưởng giữ lại 165.00 USD chi phí chuẩn bị đã bỏ ra, số tiền ký quỹ còn lại (295.00 USD) được hoàn trả ngay cho khách Elena R.
                                        </p>
                                    </div>

                                    {/* Lợi ích của phương án A */}
                                    <div className="bg-zinc-50 rounded-xl p-3 space-y-2 border border-zinc-200/50 text-xs">
                                        <div className="flex items-center gap-2 text-zinc-800">
                                            <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                                            <span>Bảo toàn 100% điểm uy tín giao hàng đúng hạn</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-zinc-800">
                                            <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                                            <span>Không bị trừ điểm xếp hạng trên Hiệp hội Atelier</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-zinc-800">
                                            <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                                            <span>Giải ngân ngay 165.00 USD vào ví tiền của xưởng</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-zinc-100 space-y-1.5">
                                    <button
                                        type="button"
                                        onClick={handleAcceptSettlement}
                                        className="w-full h-11 bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-2xs"
                                    >
                                        <Check className="w-4 h-4 text-[#f0592a]" />
                                        <span>Đồng ý hủy đơn (Nhận phí $165)</span>
                                    </button>
                                    <span className="text-[11px] text-center text-zinc-400 block">
                    Khách hàng đã đồng ý mức phí này theo điều khoản hợp đồng.
                  </span>
                                </div>
                            </div>

                            {/* Phương án B: Đề xuất đẩy tiến độ giao hỏa tốc */}
                            <div className="bg-white rounded-2xl p-5 shadow-xs border border-zinc-200/70 flex flex-col justify-between hover:shadow-md transition-shadow space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-800 bg-zinc-100 px-2.5 py-0.5 rounded-full">
                      <Zap className="w-3.5 h-3.5 text-[#f0592a]" /> PHƯƠNG ÁN ĐỀ XUẤT LẠI
                    </span>
                                        <span className="text-xs font-mono font-bold text-zinc-400">HƯỚNG B</span>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-zinc-950">
                                            Đề xuất tăng tốc giao hỏa tốc (Ngày 20/10)
                                        </h3>
                                        <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                                            Bố trí thợ tăng ca đêm cuối tuần & sử dụng dịch vụ vận chuyển hỏa tốc ưu tiên để kịp ngày biểu diễn của Studio Berlin mà không phải bỏ hủy bộ sưu tập.
                                        </p>
                                    </div>

                                    {/* Chi tiết điều kiện phương án B */}
                                    <div className="bg-zinc-50 rounded-xl p-3 space-y-2 border border-zinc-200/50 text-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="text-zinc-500">Mục tiêu giao hỏa tốc:</span>
                                            <span className="font-bold text-zinc-900">Thứ Sáu, 20/10 (Hamburg)</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-zinc-500">Phụ phí tăng ca ca đêm:</span>
                                            <span className="font-bold text-[#f0592a]">+ $85.00 Chuyển phát nhanh</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-zinc-500">Giữ nguyên giá trị đơn:</span>
                                            <span className="font-bold text-emerald-700">920.00 USD Tổng doanh thu</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-zinc-100 space-y-1.5">
                                    <button
                                        type="button"
                                        onClick={handleOfferExpedited}
                                        className="w-full h-11 bg-[#f0592a] hover:bg-[#d94a1f] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xs"
                                    >
                                        <FastForward className="w-4 h-4" />
                                        <span>Gửi đề xuất giao hỏa tốc ngày 20/10</span>
                                    </button>
                                    <span className="text-[11px] text-center text-zinc-400 block">
                    Khách hàng có 12 giờ để phản hồi đồng ý điều khoản mới.
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI (Sidebar Sổ cái ký quỹ, Trọng tài viên & FAQ) */}
                <aside className="w-full xl:w-[380px] flex-shrink-0 space-y-5">

                    {/* Thẻ Phân bổ tiền Ký quỹ (Escrow Allocation) */}
                    <div className="bg-white rounded-2xl p-5 shadow-xs border border-zinc-200/70 space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <span className="text-sm font-bold text-zinc-950">Phân bổ tiền Ký quỹ</span>
                            <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                BẢO VỆ CHẶT CHẼ
              </span>
                        </div>

                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between items-center text-zinc-600">
                                <span>Tổng giá trị hợp đồng:</span>
                                <span className="font-mono font-bold text-zinc-950">920.00 USD</span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-900 font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  Ký quỹ Giai đoạn 1 (Đang giữ):
                </span>
                                <span className="font-mono text-emerald-700 font-bold">460.00 USD</span>
                            </div>
                            <div className="flex justify-between items-center text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-zinc-300"></span>
                  Ký quỹ Giai đoạn 2 (Chưa xuất xưởng):
                </span>
                                <span className="font-mono">460.00 USD (Chưa tính)</span>
                            </div>
                        </div>

                        {/* Thanh biểu đồ tỷ lệ ký quỹ */}
                        <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden flex">
                            <div className="bg-[#f0592a] h-full w-1/2" title="Đang khóa trong ký quỹ ($460.00)"></div>
                            <div className="bg-zinc-200 h-full w-1/2 opacity-60" title="Chưa kích hoạt ($460.00)"></div>
                        </div>

                        {/* Kịch bản phân chia nếu đồng ý hòa giải */}
                        <div className="bg-[#faf8e4]/60 rounded-xl p-3.5 border border-[#f0592a]/20 space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider block">
                Nếu chấp thuận Hòa giải Phương án A:
              </span>
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-700">Bồi hoàn vật tư cho Xưởng may:</span>
                                <span className="font-mono font-bold text-emerald-700">+165.00 USD</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-700">Hoàn lại vào tài khoản Người mua:</span>
                                <span className="font-mono font-bold text-[#f0592a]">295.00 USD</span>
                            </div>
                        </div>
                    </div>

                    {/* Câu hỏi thường gặp về xử lý khiếu nại (FAQ Accordion) */}
                    <div className="bg-white rounded-2xl p-5 shadow-xs border border-zinc-200/70 space-y-3">
                        <h4 className="text-sm font-bold text-zinc-950 border-b border-zinc-100 pb-2">
                            Câu hỏi thường gặp về Hòa giải
                        </h4>

                        <div className="divide-y divide-zinc-100 text-xs">
                            <details className="group py-2.5">
                                <summary className="flex justify-between items-center font-semibold text-zinc-900 cursor-pointer list-none">
                                    <span>Chi phí vật tư được tính như thế nào?</span>
                                    <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition-transform" />
                                </summary>
                                <p className="text-zinc-600 mt-2 leading-relaxed">
                                    Xưởng nộp hóa đơn chứng từ phôi vải đã bóc niêm phong không thể trả lại, mẻ màu nhuộm pha riêng hoặc khung in đã phơi. Trọng tài viên đối chiếu định mức ngành để phê duyệt khoản bồi hoàn thỏa đáng.
                                </p>
                            </details>

                            <details className="group py-2.5">
                                <summary className="flex justify-between items-center font-semibold text-zinc-900 cursor-pointer list-none">
                                    <span>Số vải phôi đã cắt/bóc sẽ xử lý ra sao?</span>
                                    <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition-transform" />
                                </summary>
                                <p className="text-zinc-600 mt-2 leading-relaxed">
                                    Vì phía Studio Berlin bồi hoàn 120 USD tiền phôi vải khi hủy đơn, quyền sở hữu vật lý số vải phôi này thuộc về xưởng may để tái sử dụng cho các đơn hàng tiếp theo.
                                </p>
                            </details>

                            <details className="group py-2.5">
                                <summary className="flex justify-between items-center font-semibold text-zinc-900 cursor-pointer list-none">
                                    <span>Việc này có ảnh hưởng điểm xưởng không?</span>
                                    <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition-transform" />
                                </summary>
                                <p className="text-zinc-600 mt-2 leading-relaxed">
                                    Không. Hủy đơn do lịch trình khách hàng thay đổi không bị trừ điểm uy tín xưởng may, miễn là bạn phản hồi trong thời hạn 48 giờ quy định.
                                </p>
                            </details>
                        </div>
                    </div>
                </aside>

            </div>

            {/* 4. Hộp Toast thông báo phản hồi thao tác */}
            {toast.show && (
                <div className="fixed bottom-6 right-6 max-w-md bg-white border border-zinc-200 shadow-xl rounded-2xl p-4 flex items-start gap-3 z-50 animate-in fade-in slide-in-from-bottom-5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        toast.type === 'danger' ? 'bg-red-50 text-red-600' :
                            toast.type === 'info' ? 'bg-sky-50 text-sky-700' :
                                'bg-emerald-50 text-emerald-700'
                    }`}>
                        <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div className="flex-1">
                        <h5 className="text-xs font-bold text-zinc-950">{toast.title}</h5>
                        <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">{toast.message}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setToast((prev) => ({ ...prev, show: false }))}
                        className="text-zinc-400 hover:text-zinc-700"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}