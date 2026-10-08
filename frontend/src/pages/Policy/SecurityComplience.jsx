import React from 'react';
import { Link } from 'react-router-dom';

export default function SecurityCompliance() {
    return (
        <div className="w-full min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">

            {/* WRAPPER CHUNG */}
            <div className="max-w-3xl mx-auto">

                {/* Breadcrumb */}
                <nav className="mb-6 text-sm text-zinc-500" aria-label="Breadcrumb">
                    <Link to="/" className="hover:text-[#f0592a] transition-colors">Trang chủ</Link>
                    <span className="mx-2">/</span>
                    <span className="text-zinc-900 font-medium">Bảo mật & Tuân thủ</span>
                </nav>

                {/* Main Content Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-200/60 p-8 sm:p-12 lg:p-16">

                    {/* Tiêu đề trang */}
                    <div className="mb-10 border-b border-zinc-100 pb-8">
                        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-zinc-900 mb-4">
                            Bảo mật & Tuân thủ
                        </h1>
                        <p className="text-sm text-zinc-500">
                            Cập nhật lần cuối: <span className="font-medium">Tháng 10, 2026</span>
                        </p>
                    </div>

                    {/* Nội dung chính */}
                    <div className="space-y-10 text-zinc-600 text-sm sm:text-base leading-relaxed">

                        {/* Intro */}
                        <section>
                            <p className="mb-4">
                                Tại <strong className="text-zinc-900">Atelier</strong>, chúng tôi hiểu rằng sự tin tưởng của Khách hàng, Nhà thiết kế (Designer) và Xưởng sản xuất (Producer) là tài sản quý giá nhất. Vì vậy, bảo mật thông tin và tuân thủ các tiêu chuẩn pháp lý là nền tảng cốt lõi trong mọi hoạt động vận hành của chúng tôi.
                            </p>
                            <p>
                                Trang này cung cấp tổng quan về các biện pháp kỹ thuật và chính sách mà Atelier áp dụng để bảo vệ dữ liệu và duy trì môi trường giao dịch an toàn.
                            </p>
                        </section>

                        {/* Mục 1 */}
                        <section>
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">1. An toàn Hạ tầng & Hệ thống</h2>
                            <ul className="list-disc pl-5 space-y-3 marker:text-zinc-400">
                                <li>
                                    <strong className="text-zinc-800">Bảo mật đường truyền (SSL/TLS):</strong> Toàn bộ dữ liệu trao đổi giữa trình duyệt của bạn và máy chủ Atelier đều được mã hóa bằng giao thức SSL/TLS chuẩn ngành, ngăn chặn nguy cơ bị đánh cắp dữ liệu trên đường truyền.
                                </li>
                                <li>
                                    <strong className="text-zinc-800">Lưu trữ Đám mây An toàn:</strong> Dữ liệu hệ thống được lưu trữ trên hạ tầng đám mây tin cậy cao. Các tệp tin đa phương tiện và bản vẽ thiết kế được mã hóa và quản lý bởi đối tác Cloudinary, đảm bảo tính toàn vẹn và chống truy cập trái phép.
                                </li>
                                <li>
                                    <strong className="text-zinc-800">Mã hóa Mật khẩu:</strong> Mật khẩu tài khoản của bạn được mã hóa một chiều (hashing) bằng các thuật toán mạnh mẽ nhất. Ngay cả các kỹ sư và quản trị viên của Atelier cũng không thể đọc được mật khẩu gốc của bạn.
                                </li>
                            </ul>
                        </section>

                        {/* Mục 2 */}
                        <section>
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">2. Tuân thủ Bảo mật Thanh toán</h2>
                            <p className="mb-4">Atelier không trực tiếp lưu trữ hay xử lý dữ liệu thẻ tín dụng/tài khoản ngân hàng của bạn. Chúng tôi tuân thủ nghiêm ngặt các quy chuẩn thanh toán quốc tế:</p>
                            <ul className="list-disc pl-5 space-y-3 marker:text-zinc-400">
                                <li>Mọi giao dịch thanh toán đều được định tuyến qua các Cổng thanh toán đối tác uy tín (như VNPay, MoMo, ZaloPay, Stripe...).</li>
                                <li>Các đối tác thanh toán của chúng tôi đều đạt chứng nhận <strong className="text-zinc-900">PCI-DSS (Payment Card Industry Data Security Standard)</strong> Mức 1 – cấp độ bảo mật cao nhất hiện nay.</li>
                            </ul>
                        </section>

                        {/* Mục 3 */}
                        <section>
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">3. Tuân thủ Sở hữu Trí tuệ (DMCA)</h2>
                            <p className="mb-4">
                                Là một nền tảng đề cao sự sáng tạo, Atelier có chính sách Không khoan nhượng (Zero-Tolerance) với các hành vi vi phạm bản quyền:
                            </p>
                            <ul className="list-disc pl-5 space-y-3 marker:text-zinc-400">
                                <li>
                                    <strong className="text-zinc-800">Bảo vệ bản quyền thiết kế:</strong> Nếu bạn là chủ sở hữu hợp pháp của một tác phẩm và phát hiện thiết kế của mình bị đăng bán trái phép trên Atelier, vui lòng gửi báo cáo vi phạm (Takedown Notice). Chúng tôi sẽ xác minh và gỡ bỏ nội dung vi phạm trong vòng <span className="text-[#f0592a] font-medium">48-72 giờ</span>.
                                </li>
                                <li>
                                    <strong className="text-zinc-800">Xử lý tài khoản vi phạm:</strong> Các tài khoản Designer bị phát hiện ăn cắp chất xám hoặc vi phạm bản quyền thương hiệu sẽ bị khóa vĩnh viễn và thu hồi toàn bộ doanh thu chưa đối soát.
                                </li>
                            </ul>
                        </section>

                        {/* Mục 4 */}
                        <section>
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">4. Kiểm soát Truy cập & Quy trình Nội bộ</h2>
                            <ul className="list-disc pl-5 space-y-3 marker:text-zinc-400">
                                <li>
                                    <strong className="text-zinc-800">Giới hạn đặc quyền:</strong> Chỉ những nhân viên có thẩm quyền và cần thiết cho việc hỗ trợ khách hàng mới được cấp quyền truy cập vào các dữ liệu nhạy cảm. Toàn bộ thao tác truy cập đều được hệ thống ghi log lưu vết.
                                </li>
                                <li>
                                    <strong className="text-zinc-800">Quyền riêng tư của thiết kế:</strong> Nhân sự Atelier và Producer tuyệt đối không được phép tải xuống hoặc sử dụng các tệp tin thiết kế (Artwork files) cho bất kỳ mục đích nào khác ngoài việc thực thi quy trình in ấn/sản xuất đơn hàng hiện hành.
                                </li>
                            </ul>
                        </section>

                        {/* Mục 5 */}
                        <section className="bg-zinc-50 p-6 rounded-xl border border-zinc-100">
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">5. Báo cáo Lỗ hổng & Liên hệ Bảo mật</h2>
                            <p className="mb-4">
                                Chúng tôi luôn hoan nghênh sự đóng góp từ cộng đồng chuyên gia an ninh mạng. Nếu bạn phát hiện bất kỳ lỗ hổng bảo mật nào trên hệ thống của Atelier, xin vui lòng báo cáo cho chúng tôi trước khi công khai.
                            </p>
                            <ul className="space-y-2 text-zinc-700">
                                <li><strong className="text-zinc-900">Email báo cáo bảo mật/bản quyền:</strong> <a href="mailto:security@atelier.com" className="text-[#f0592a] hover:underline font-medium">[security@atelier.com]</a></li>
                                <li><strong className="text-zinc-900">Thời gian phản hồi dự kiến:</strong> <span className="text-[#f0592a] font-medium">Trong vòng 24 giờ làm việc</span></li>
                            </ul>
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