import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight, FileText } from 'lucide-react';
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";

export default function OrderSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#fdfbf4] flex flex-col items-center justify-center py-12 font-sans px-4">
            <Container className="max-w-2xl text-center">

                {/* Icon Thành Công */}
                <div className="relative inline-flex items-center justify-center mb-8">
                    <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-white rounded-full p-4 shadow-sm border border-green-50">
                        <CheckCircle2 className="w-20 h-20 text-green-500" />
                    </div>
                </div>

                {/* Tiêu đề */}
                <h1 className="text-3xl font-extrabold text-zinc-900 mb-4 tracking-tight">
                    Đặt Hàng Thành Công!
                </h1>

                <p className="text-zinc-600 text-base mb-8 max-w-md mx-auto leading-relaxed">
                    Cảm ơn bạn đã tin tưởng hệ thống Atelier. Đơn hàng của bạn đã được ghi nhận và đang trong quá trình xử lý.
                    Chúng tôi sẽ sớm liên hệ với bạn để cập nhật tiến độ sản xuất.
                </p>

                {/* Box hiển thị mã đơn (nếu có) */}
                {orderId && (
                    <div className="bg-white border border-zinc-200 rounded-xl p-4 inline-flex items-center gap-3 mb-8 shadow-sm">
                        <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center text-zinc-400">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div className="text-left pr-4">
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-0.5">Mã tra cứu đơn hàng</p>
                            <p className="text-lg font-bold text-zinc-900">#{orderId}</p>
                        </div>
                    </div>
                )}

                {/* Nút điều hướng */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {orderId && (
                        <Button
                            onClick={() => navigate(`/order_detail/${orderId}`)}
                            className="w-full sm:w-auto bg-white text-zinc-800 border border-zinc-200 hover:border-[#f0592a] hover:text-[#f0592a] px-8 py-3.5 font-bold shadow-sm"
                        >
                            Xem chi tiết đơn hàng
                        </Button>
                    )}

                    <Button
                        onClick={() => navigate('/')}
                        className="w-full sm:w-auto bg-[#f0592a] text-white hover:bg-[#d94a1f] px-8 py-3.5 flex items-center justify-center gap-2 font-bold shadow-md"
                    >
                        Tiếp tục mua sắm <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>

            </Container>
        </div>
    );
}