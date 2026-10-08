import React from 'react';
import { Link } from 'react-router-dom';

export default function HelpSupport() {
    return (
        <div className="w-full min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">

            {/* WRAPPER CHUNG */}
            <div className="max-w-3xl mx-auto">

                {/* Breadcrumb */}
                <nav className="mb-6 text-sm text-zinc-500" aria-label="Breadcrumb">
                    <Link to="/" className="hover:text-[#f0592a] transition-colors">Trang chủ</Link>
                    <span className="mx-2">/</span>
                    <span className="text-zinc-900 font-medium">Trợ giúp & Hỗ trợ</span>
                </nav>

                {/* Main Content Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-200/60 p-8 sm:p-12 lg:p-16">

                    {/* Tiêu đề trang */}
                    <div className="mb-10 border-b border-zinc-100 pb-8">
                        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-zinc-900 mb-4">
                            Trung tâm Trợ giúp
                        </h1>
                        <p className="text-sm text-zinc-500">
                            Chúng tôi luôn sẵn sàng hỗ trợ bạn giải quyết mọi vấn đề trên nền tảng.
                        </p>
                    </div>

                    {/* Nội dung chính */}
                    <div className="space-y-10 text-zinc-600 text-sm sm:text-base leading-relaxed">

                        {/* Intro */}
                        <section>
                            <p>
                                Bạn đang gặp khó khăn trong quá trình sử dụng <strong className="text-zinc-900">Atelier</strong>? Hãy tra cứu các câu hỏi thường gặp dưới đây hoặc liên hệ trực tiếp với đội ngũ Chăm sóc khách hàng của chúng tôi để được giải đáp nhanh nhất.
                            </p>
                        </section>

                        {/* FAQs Section */}
                        <section>
                            <h2 className="text-xl font-medium text-zinc-900 mb-6">Câu hỏi thường gặp (FAQ)</h2>

                            <div className="space-y-6">
                                {/* FAQ Item 1 */}
                                <div className="bg-zinc-50 p-5 sm:p-6 rounded-xl border border-zinc-100">
                                    <h3 className="font-medium text-zinc-900 mb-2">1. Định dạng file thiết kế (Artwork) nào được chấp nhận?</h3>
                                    <p>
                                        Đối với <strong className="text-zinc-800">Designer</strong>, hệ thống Atelier chấp nhận các tệp thiết kế ở định dạng <strong>PNG (nền trong suốt)</strong>, hệ màu RGB. Để đảm bảo bản in ra áo sắc nét nhất, độ phân giải tối thiểu yêu cầu là <strong>300 DPI</strong>. Dung lượng file tối đa không vượt quá 25MB.
                                    </p>
                                </div>

                                {/* FAQ Item 2 */}
                                <div className="bg-zinc-50 p-5 sm:p-6 rounded-xl border border-zinc-100">
                                    <h3 className="font-medium text-zinc-900 mb-2">2. Bao lâu thì tôi nhận được tiền thanh toán?</h3>
                                    <p>
                                        Atelier thực hiện đối soát và thanh toán tự động vào <strong className="text-zinc-800">ngày 10 và ngày 25 hàng tháng</strong>. Doanh thu hợp lệ được tính từ các đơn hàng đã được cập nhật trạng thái "Giao hàng thành công" và vượt qua khoảng thời gian 7 ngày khiếu nại.
                                    </p>
                                </div>

                                {/* FAQ Item 3 */}
                                <div className="bg-zinc-50 p-5 sm:p-6 rounded-xl border border-zinc-100">
                                    <h3 className="font-medium text-zinc-900 mb-2">3. Nếu đơn hàng in ra bị lỗi thì xử lý thế nào?</h3>
                                    <p className="mb-2">
                                        Quy trình bồi thường được phân định rõ ràng trên hệ thống:
                                    </p>
                                    <ul className="list-disc pl-5 space-y-1 marker:text-zinc-400">
                                        <li>Nếu lỗi xuất phát từ khâu in ấn hoặc may mặc (sai màu, lệch form, bong tróc): <strong className="text-zinc-800">Producer</strong> chịu trách nhiệm sản xuất lại.</li>
                                        <li>Nếu lỗi do file thiết kế tải lên bị vỡ nét hoặc sai chi tiết: <strong className="text-zinc-800">Designer</strong> chịu trách nhiệm bồi thường chi phí sản xuất.</li>
                                    </ul>
                                </div>

                                {/* FAQ Item 4 */}
                                <div className="bg-zinc-50 p-5 sm:p-6 rounded-xl border border-zinc-100">
                                    <h3 className="font-medium text-zinc-900 mb-2">4. Làm sao để tôi khôi phục mật khẩu?</h3>
                                    <p>
                                        Tại trang Đăng nhập, bạn hãy nhấn vào nút <strong>"Quên mật khẩu"</strong>. Hệ thống sẽ gửi một liên kết bảo mật (hoặc mã OTP) đến địa chỉ email mà bạn đã dùng để đăng ký tài khoản. Vui lòng kiểm tra cả hộp thư rác (Spam) nếu không nhận được ở hộp thư chính.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Liên hệ trực tiếp */}
                        <section className="bg-white border-2 border-zinc-100 p-6 sm:p-8 rounded-2xl shadow-sm mt-12">
                            <h2 className="text-xl font-medium text-zinc-900 mb-2">Vẫn cần thêm sự trợ giúp?</h2>
                            <p className="mb-8">Đội ngũ hỗ trợ của Atelier luôn có mặt để giải quyết các vấn đề phức tạp hơn của bạn.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Khối Email */}
                                <div className="p-5 bg-zinc-50 rounded-xl border border-zinc-100/80 hover:border-zinc-200 transition-colors">
                                    <h3 className="font-medium text-zinc-900 mb-1">Hỗ trợ qua Email</h3>
                                    <p className="text-sm text-zinc-500 mb-3">Thời gian phản hồi dự kiến: 24h</p>
                                    <a href="mailto:support@atelier.com" className="text-[#f0592a] hover:underline font-medium break-all">
                                        [support@atelier.com]
                                    </a>
                                </div>

                                {/* Khối Hotline */}
                                <div className="p-5 bg-zinc-50 rounded-xl border border-zinc-100/80 hover:border-zinc-200 transition-colors">
                                    <h3 className="font-medium text-zinc-900 mb-1">Đường dây nóng</h3>
                                    <p className="text-sm text-zinc-500 mb-3">Thứ 2 - Thứ 6 (9:00 - 18:00)</p>
                                    <span className="text-[#f0592a] font-medium">
                                        [0123 456 789]
                                    </span>
                                </div>
                            </div>
                        </section>

                    </div>

                    {/* Back button */}
                    <div className="mt-12 pt-8 border-t border-zinc-100 text-center">
                        <Link to="/" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                            &larr; Quay lại trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}