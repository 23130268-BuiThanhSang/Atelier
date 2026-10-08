import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
    return (
        <div className="w-full min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">

            {/* WRAPPER CHUNG */}
            <div className="max-w-3xl mx-auto">

                {/* Breadcrumb */}
                <nav className="mb-6 text-sm text-zinc-500" aria-label="Breadcrumb">
                    <Link to="/" className="hover:text-[#f0592a] transition-colors">Trang chủ</Link>
                    <span className="mx-2">/</span>
                    <span className="text-zinc-900 font-medium">Điều khoản dịch vụ</span>
                </nav>

                {/* Main Content Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-200/60 p-8 sm:p-12 lg:p-16">

                    {/* Tiêu đề trang */}
                    <div className="mb-10 border-b border-zinc-100 pb-8">
                        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-zinc-900 mb-4">
                            Điều khoản Dịch vụ
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
                                Chào mừng quý khách đến với nền tảng <strong className="text-zinc-900">Atelier</strong>.
                            </p>
                            <p>
                                Khi truy cập, đăng ký tài khoản và sử dụng các dịch vụ trên trang web của chúng tôi, đồng nghĩa với việc quý khách đã đọc, hiểu và đồng ý ràng buộc bởi các Điều khoản Dịch vụ dưới đây. Nếu quý khách không đồng ý với bất kỳ phần nào của điều khoản này, vui lòng ngừng sử dụng Dịch vụ.
                            </p>
                        </section>

                        {/* Mục 1 */}
                        <section>
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">1. Vai trò của Atelier</h2>
                            <p>
                                Atelier hoạt động như một nền tảng thương mại điện tử (Marketplace) trung gian, cung cấp không gian kết nối giữa <strong>Người thiết kế (Designer)</strong>, <strong>Xưởng sản xuất (Producer)</strong> và <strong>Khách hàng mua lẻ</strong>.
                                Chúng tôi cung cấp công cụ đăng bán, quản lý đơn hàng và xử lý thanh toán, nhưng <strong className="text-zinc-900">Atelier không trực tiếp sản xuất hàng hóa</strong> và <strong className="text-zinc-900">không sở hữu bản quyền</strong> của các thiết kế được đăng tải trên nền tảng.
                            </p>
                        </section>

                        {/* Mục 2 */}
                        <section>
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">2. Tài khoản và Trách nhiệm người dùng</h2>
                            <p className="mb-4">Người dùng phải đảm bảo đủ 18 tuổi hoặc có sự giám sát của người giám hộ hợp pháp khi giao dịch. Tùy thuộc vào vai trò, bạn phải tuân thủ các quy định sau:</p>
                            <ul className="list-disc pl-5 space-y-3 marker:text-zinc-400">
                                <li>
                                    <strong className="text-zinc-800">Đối với Designer:</strong> Bạn cam kết tự chịu trách nhiệm hoàn toàn về tính hợp pháp của các tệp thiết kế (design files) tải lên hệ thống. Đảm bảo thiết kế là sáng tạo gốc hoặc bạn có đầy đủ quyền sử dụng thương mại.
                                </li>
                                <li>
                                    <strong className="text-zinc-800">Đối với Producer:</strong> Bạn cam kết cung cấp thông tin trung thực về năng lực sản xuất, đảm bảo chất lượng vải, kỹ thuật in ấn và tuân thủ đúng thời gian chuẩn bị hàng (lead time) đã công bố trên nền tảng.
                                </li>
                            </ul>
                        </section>

                        {/* Mục 3 */}
                        <section>
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">3. Quyền Sở hữu Trí tuệ (Bản quyền)</h2>
                            <p className="mb-4">Atelier tôn trọng tuyệt đối chất xám của những nhà sáng tạo. Quy định về bản quyền được thực thi nghiêm ngặt như sau:</p>
                            <ul className="list-disc pl-5 space-y-3 marker:text-zinc-400">
                                <li>
                                    <strong className="text-zinc-800">Designer sở hữu 100%:</strong> Mọi quyền sở hữu trí tuệ đối với tác phẩm vẫn thuộc về Designer.
                                </li>
                                <li>
                                    <strong className="text-zinc-800">Giới hạn của Producer:</strong> Xưởng sản xuất (Producer) chỉ được phép tải xuống và sử dụng tệp thiết kế của Designer với mục đích duy nhất là <strong className="text-zinc-900">in ấn cho chính đơn hàng phát sinh trên Atelier</strong>. Nghiêm cấm mọi hành vi sao chép, lưu trữ để bán ra ngoài hoặc sử dụng cho mục đích khác. Vi phạm sẽ dẫn đến khóa tài khoản vĩnh viễn và chịu trách nhiệm trước pháp luật.
                                </li>
                                <li>
                                    <strong className="text-zinc-800">Quyền của Atelier:</strong> Bằng việc đăng bán, Designer cấp cho Atelier quyền (License) sử dụng hình ảnh thiết kế đó để hiển thị trên website, phục vụ cho mục đích quảng bá sản phẩm.
                                </li>
                            </ul>
                        </section>

                        {/* Mục 4 */}
                        <section>
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">4. Giao dịch, Phí dịch vụ và Thanh toán</h2>
                            <ul className="list-disc pl-5 space-y-3 marker:text-zinc-400">
                                <li>
                                    <strong className="text-zinc-800">Thanh toán an toàn:</strong> Tiền thanh toán của Khách hàng mua lẻ sẽ được Atelier giữ trung gian an toàn (Escrow) cho đến khi đơn hàng được xác nhận giao thành công.
                                </li>
                                <li>
                                    <strong className="text-zinc-800">Phí dịch vụ (Commission):</strong> Atelier sẽ khấu trừ một khoản phí dịch vụ nền tảng là <span className="text-[#f0592a] font-medium">[X]%</span> trên tổng giá trị đơn hàng trước khi phân bổ lợi nhuận cho Designer và Producer. Mức phí này có thể thay đổi và sẽ được thông báo trước.
                                </li>
                                <li>
                                    <strong className="text-zinc-800">Chu kỳ đối soát:</strong> Doanh thu của Designer và Producer sẽ được đối soát và chuyển khoản vào <span className="text-[#f0592a] font-medium">[ngày 10 và 25 hàng tháng / sau 7 ngày đơn hàng hoàn thành]</span>.
                                </li>
                            </ul>
                        </section>

                        {/* Mục 5 */}
                        <section>
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">5. Xử lý sự cố và Đổi trả</h2>
                            <p className="mb-4">Trong trường hợp sản phẩm đến tay khách hàng bị lỗi, trách nhiệm bồi thường/đổi trả được phân định như sau:</p>
                            <ul className="list-disc pl-5 space-y-3 marker:text-zinc-400">
                                <li>
                                    <strong className="text-zinc-800">Lỗi từ Producer:</strong> Nếu sản phẩm bị may lỗi form, sai kích thước, in sai màu, hình in bong tróc hoặc giao sai hàng, Producer sẽ chịu 100% chi phí đổi trả và bồi thường đơn hàng.
                                </li>
                                <li>
                                    <strong className="text-zinc-800">Lỗi từ Designer:</strong> Nếu hình in bị vỡ, mờ hoặc sai chi tiết do tệp thiết kế (design file) tải lên không đạt độ phân giải tối thiểu như quy định, Designer sẽ chịu trách nhiệm bồi thường chi phí sản xuất cho đơn hàng đó.
                                </li>
                                <li>Atelier sẽ đóng vai trò trọng tài cuối cùng để phân xử dựa trên bằng chứng do các bên cung cấp.</li>
                            </ul>
                        </section>

                        {/* Mục 6 */}
                        <section>
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">6. Quy định chống gian lận</h2>
                            <p>
                                Để bảo vệ môi trường kinh doanh công bằng, nghiêm cấm Designer và Producer trao đổi thông tin liên lạc cá nhân (Số điện thoại, Zalo, Facebook, Email) hoặc lôi kéo khách hàng thực hiện giao dịch bên ngoài nền tảng Atelier nhằm mục đích né tránh phí dịch vụ. Mọi hành vi vi phạm khi bị hệ thống phát hiện sẽ dẫn đến việc đóng băng số dư và <strong className="text-zinc-900 text-red-600">xóa tài khoản vĩnh viễn</strong>.
                            </p>
                        </section>

                        {/* Mục 7 */}
                        <section>
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">7. Thay đổi Điều khoản</h2>
                            <p>
                                Atelier có quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ phần nào trong Điều khoản Dịch vụ này vào bất cứ lúc nào để phù hợp với quy định của pháp luật hoặc định hướng kinh doanh. Các thay đổi có hiệu lực ngay khi được đăng tải. Việc tiếp tục sử dụng Dịch vụ sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận những cập nhật đó.
                            </p>
                        </section>

                        {/* Mục 8 */}
                        <section className="bg-zinc-50 p-6 rounded-xl border border-zinc-100">
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">8. Liên hệ với chúng tôi</h2>
                            <p className="mb-4">Mọi thắc mắc liên quan đến Điều khoản Dịch vụ hoặc phản ánh vi phạm, vui lòng liên hệ Ban quản trị Atelier qua:</p>
                            <ul className="space-y-2 text-zinc-700">
                                <li><strong className="text-zinc-900">Email:</strong> <a href="mailto:legal@atelier.com" className="text-[#f0592a] hover:underline font-medium">[legal@atelier.com]</a></li>
                                <li><strong className="text-zinc-900">Hotline:</strong> <span className="text-[#f0592a] font-medium">[0123 456 789]</span></li>
                                <li><strong className="text-zinc-900">Thời gian làm việc:</strong> Thứ 2 - Thứ 6 (9:00 - 18:00)</li>
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