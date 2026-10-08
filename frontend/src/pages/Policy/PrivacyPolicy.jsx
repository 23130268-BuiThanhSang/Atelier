import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
    return (
        <div className="w-full min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">

                <nav className="mb-6 text-sm text-zinc-500" aria-label="Breadcrumb">
                    <Link to="/" className="hover:text-[#f0592a] transition-colors">Trang chủ</Link>
                    <span className="mx-2">/</span>
                    <span className="text-zinc-900 font-medium">Chính sách bảo mật</span>
                </nav>

                <div className="bg-white rounded-2xl shadow-sm border border-zinc-200/60 p-8 sm:p-12 lg:p-16">

                    {/* Tiêu đề trang */}
                    <div className="mb-10 border-b border-zinc-100 pb-8">
                        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-zinc-900 mb-4">
                            Chính sách Bảo mật Dữ liệu
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
                                <strong className="text-zinc-900">Atelier</strong> (“chúng tôi”, “của chúng tôi”) cam kết bảo vệ quyền riêng tư của bạn. Chính sách Bảo mật này giải thích cách thông tin cá nhân của bạn được thu thập, sử dụng và tiết lộ bởi Atelier.
                            </p>
                            <p>
                                Chính sách Bảo mật này áp dụng cho trang web của chúng tôi và các tên miền phụ liên quan (gọi chung là “Dịch vụ”). Bằng việc truy cập hoặc sử dụng Dịch vụ của chúng tôi, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý với việc chúng tôi thu thập, lưu trữ, sử dụng và tiết lộ thông tin cá nhân của bạn như mô tả trong Chính sách Bảo mật này và trong Điều khoản Dịch vụ.
                            </p>
                        </section>

                        {/* Mục 1 */}
                        <section>
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">1. Định nghĩa và thuật ngữ</h2>
                            <ul className="list-disc pl-5 space-y-2 marker:text-zinc-400">
                                <li><strong className="text-zinc-800">Công ty:</strong> Khi Chính sách này đề cập đến “Công ty”, “chúng tôi” hoặc “của chúng tôi”, điều đó có nghĩa là <span className="text-[#f0592a] font-medium">[Công ty TNHH Atelier]</span>, đơn vị chịu trách nhiệm đối với thông tin của bạn.</li>
                                <li><strong className="text-zinc-800">Quốc gia:</strong> Nơi Atelier hoặc những người sáng lập/chủ sở hữu đặt trụ sở – trong trường hợp này là Việt Nam.</li>
                                <li><strong className="text-zinc-800">Trang web:</strong> Trang web chính thức của Atelier, có thể truy cập tại: <span className="text-[#f0592a] font-medium">[https://atelier.com]</span>.</li>
                                <li><strong className="text-zinc-800">Khách hàng:</strong> Cá nhân hoặc tổ chức đăng ký tài khoản để sử dụng Dịch vụ của Atelier (bao gồm cả vai trò Designer và Producer).</li>
                                <li><strong className="text-zinc-800">Dữ liệu cá nhân:</strong> Bất kỳ thông tin nào cho phép nhận diện một cá nhân, trực tiếp hoặc gián tiếp.</li>
                                <li><strong className="text-zinc-800">Cookie:</strong> Một lượng dữ liệu nhỏ được tạo ra bởi trang web và lưu trong trình duyệt của bạn nhằm nhận diện trình duyệt, cung cấp phân tích và ghi nhớ thông tin đăng nhập.</li>
                            </ul>
                        </section>

                        {/* Mục 2 */}
                        <section>
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">2. Chúng tôi thu thập thông tin gì?</h2>
                            <p className="mb-4">Chúng tôi thu thập thông tin từ bạn khi bạn truy cập website, đăng ký tài khoản, kết nối qua mạng xã hội (Google) hoặc điền vào các biểu mẫu. Thông tin bao gồm:</p>
                            <ul className="list-disc pl-5 space-y-2 marker:text-zinc-400">
                                <li>Họ và tên</li>
                                <li>Địa chỉ email</li>
                                <li>Mật khẩu (được mã hóa)</li>
                                <li>Vai trò trên nền tảng (Designer hoặc Producer)</li>
                            </ul>
                        </section>

                        {/* Mục 3 */}
                        <section>
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">3. Thông tin từ bên thứ ba (Đăng nhập mạng xã hội)</h2>
                            <p>
                                Atelier cho phép bạn đăng ký và đăng nhập thông qua tài khoản Google. Khi bạn sử dụng tính năng này, chúng tôi sẽ nhận được các thông tin cơ bản từ Google (như tên và địa chỉ email) theo đúng các quyền mà bạn đã xác nhận cấp phép trong quá trình đăng nhập. Chúng tôi không truy cập vào mật khẩu hoặc các dữ liệu cá nhân khác trên tài khoản Google của bạn.
                            </p>
                        </section>

                        {/* Mục 4 */}
                        <section>
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">4. Chúng tôi có chia sẻ thông tin với bên thứ ba không?</h2>
                            <p className="mb-4">Có. Chúng tôi chỉ chia sẻ thông tin cá nhân của bạn trong các trường hợp cần thiết sau:</p>
                            <ul className="list-disc pl-5 space-y-2 marker:text-zinc-400">
                                <li><strong className="text-zinc-800">Nhà cung cấp dịch vụ tin cậy:</strong> Các đối tác cung cấp dịch vụ hạ tầng đám mây (như lưu trữ cơ sở dữ liệu, dịch vụ lưu trữ hình ảnh Cloudinary), quản lý email và dịch vụ chăm sóc khách hàng. Các bên này bị ràng buộc bởi các thỏa thuận bảo mật và chỉ được sử dụng dữ liệu để phục vụ cho hoạt động của Atelier.</li>
                                <li><strong className="text-zinc-800">Chuyển nhượng kinh doanh:</strong> Trong trường hợp sáp nhập, bán tài sản hoặc tái cấu trúc, thông tin có thể được chia sẻ hoặc chuyển giao cho đơn vị kế thừa.</li>
                                <li><strong className="text-zinc-800">Yêu cầu pháp lý:</strong> Các cơ quan chính phủ, cơ quan thực thi pháp luật nếu bắt buộc phải cung cấp nhằm bảo vệ quyền lợi, an toàn cộng đồng hoặc ngăn chặn hành vi vi phạm pháp luật.</li>
                            </ul>
                        </section>

                        {/* Mục 5 */}
                        <section>
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">5. Chúng tôi sử dụng thông tin như thế nào?</h2>
                            <p className="mb-4">Thông tin thu thập được sử dụng vào các mục đích:</p>
                            <ul className="list-disc pl-5 space-y-2 marker:text-zinc-400">
                                <li>Khởi tạo, xác thực và quản lý tài khoản người dùng của bạn trên nền tảng.</li>
                                <li>Cá nhân hóa trải nghiệm và cung cấp không gian làm việc phù hợp với vai trò (Designer/Producer) của bạn.</li>
                                <li>Cải thiện giao diện, tính năng trang web và nâng cao chất lượng dịch vụ khách hàng.</li>
                                <li>Gửi email thông báo liên quan đến bảo mật tài khoản, xác thực email, cập nhật dịch vụ hoặc lấy lại mật khẩu.</li>
                            </ul>
                        </section>

                        {/* Mục 6 */}
                        <section>
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">6. Chúng tôi sử dụng địa chỉ email của bạn như thế nào?</h2>
                            <ul className="list-disc pl-5 space-y-2 marker:text-zinc-400">
                                <li>Chúng tôi chỉ gửi email đến những tài khoản đã đăng ký trên hệ thống.</li>
                                <li>Chúng tôi cam kết không gửi thư rác (spam) hoặc bán danh sách email của bạn cho bên thứ ba.</li>
                                <li>Bạn có thể hủy đăng ký nhận các bản tin tiếp thị bất kỳ lúc nào thông qua liên kết Hủy đăng ký (Unsubscribe) có trong email. (Các email hệ thống bắt buộc như lấy lại mật khẩu vẫn sẽ được gửi).</li>
                            </ul>
                        </section>

                        {/* Mục 7 */}
                        <section>
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">7. Chúng tôi giữ thông tin của bạn bao lâu?</h2>
                            <p>
                                Chúng tôi chỉ lưu giữ thông tin của bạn cho đến khi tài khoản của bạn còn hoạt động hoặc khi cần thiết để cung cấp dịch vụ và tuân thủ các quy định pháp luật. Khi bạn yêu cầu xóa tài khoản, chúng tôi sẽ tiến hành xóa hoặc ẩn danh thông tin cá nhân của bạn trên cơ sở dữ liệu.
                            </p>
                        </section>

                        {/* Mục 8 */}
                        <section>
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">8. Bảo mật dữ liệu</h2>
                            <ul className="list-disc pl-5 space-y-2 marker:text-zinc-400">
                                <li>Chúng tôi áp dụng các biện pháp bảo mật tiêu chuẩn (bao gồm mã hóa đường truyền SSL và mã hóa mật khẩu trong cơ sở dữ liệu) để bảo vệ dữ liệu của bạn khỏi việc truy cập trái phép.</li>
                                <li><strong className="text-zinc-800">Lưu ý:</strong> Tuy nhiên, không có hệ thống lưu trữ hay phương thức truyền tải nào trên Internet có thể đảm bảo an toàn 100%. Mặc dù chúng tôi nỗ lực tối đa, việc truyền tải thông tin lên Dịch vụ vẫn tiềm ẩn những rủi ro nhất định mà người dùng cần nhận thức.</li>
                            </ul>
                        </section>

                        {/* Mục 9 */}
                        <section>
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">9. Quyền của bạn đối với dữ liệu</h2>
                            <p>
                                Bạn có toàn quyền truy cập, cập nhật, chỉnh sửa hoặc yêu cầu xóa dữ liệu cá nhân của mình bằng cách thay đổi thông tin trong phần Cài đặt tài khoản hoặc gửi yêu cầu xóa tài khoản đến đội ngũ hỗ trợ của chúng tôi. Chúng tôi có thể yêu cầu bạn xác minh danh tính (qua email) trước khi thực hiện các thay đổi nhằm đảm bảo an toàn.
                            </p>
                        </section>

                        {/* Mục 10 */}
                        <section>
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">10. Công nghệ theo dõi (Cookies & Local Storage)</h2>
                            <ul className="list-disc pl-5 space-y-2 marker:text-zinc-400">
                                <li><strong className="text-zinc-800">Cookies:</strong> Atelier sử dụng Cookies để duy trì phiên đăng nhập và ghi nhớ các tùy chọn của bạn trên trang web. Bạn có thể tắt Cookies trong trình duyệt, nhưng việc này sẽ khiến tính năng đăng nhập và một số chức năng cốt lõi không thể hoạt động. Chúng tôi không lưu trữ dữ liệu nhận dạng cá nhân trần (như mật khẩu chưa mã hóa) trong Cookies.</li>
                                <li><strong className="text-zinc-800">Local Storage & Sessions:</strong> Chúng tôi sử dụng bộ nhớ cục bộ của trình duyệt để lưu trữ các thông tin tạm thời nhằm tăng tốc độ tải trang và cải thiện trải nghiệm sử dụng Dịch vụ.</li>
                            </ul>
                        </section>

                        {/* Mục 11 */}
                        <section>
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">11. Thông báo vi phạm dữ liệu</h2>
                            <p className="mb-4">Trong trường hợp không may xảy ra sự cố vi phạm an toàn dữ liệu, chúng tôi cam kết:</p>
                            <ul className="list-disc pl-5 space-y-2 marker:text-zinc-400">
                                <li>Đánh giá phạm vi, nguyên nhân và tác động của sự cố.</li>
                                <li>Thông báo trực tiếp qua email cho các cá nhân bị ảnh hưởng trong thời gian sớm nhất có thể (thường trong vòng 72 giờ).</li>
                                <li>Đưa ra các hướng dẫn tự bảo vệ (ví dụ: đổi mật khẩu) và nhanh chóng thực hiện các biện pháp khắc phục hệ thống.</li>
                            </ul>
                        </section>

                        {/* Mục 12 */}
                        <section>
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">12. Luật áp dụng và Giải quyết tranh chấp</h2>
                            <p className="mb-4">
                                Chính sách Bảo mật này được điều chỉnh và giải thích theo luật pháp của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Mọi tranh chấp phát sinh trong quá trình sử dụng Dịch vụ liên quan đến quyền riêng tư sẽ được ưu tiên giải quyết thông qua thương lượng. Nếu không thành, tranh chấp sẽ thuộc thẩm quyền giải quyết của tòa án có thẩm quyền tại Việt Nam.
                            </p>
                            <p>
                                Việc bạn tiếp tục sử dụng Dịch vụ đồng nghĩa với việc bạn chấp nhận Chính sách này và mọi thay đổi, cập nhật của chúng tôi trong tương lai.
                            </p>
                        </section>

                        {/* Mục 13 */}
                        <section className="bg-zinc-50 p-6 rounded-xl border border-zinc-100">
                            <h2 className="text-xl font-medium text-zinc-900 mb-4">13. Liên hệ với chúng tôi</h2>
                            <p className="mb-4">Nếu bạn có bất kỳ thắc mắc nào về Chính sách Bảo mật này hoặc cách chúng tôi xử lý dữ liệu của bạn, vui lòng liên hệ:</p>
                            <ul className="space-y-2 text-zinc-700">
                                <li><strong className="text-zinc-900">Email:</strong> <a href="mailto:support@atelier.com" className="text-[#f0592a] hover:underline font-medium">[support@atelier.com]</a></li>
                                <li><strong className="text-zinc-900">Điện thoại:</strong> <span className="text-[#f0592a] font-medium">[0123 456 789]</span></li>
                                <li><strong className="text-zinc-900">Địa chỉ:</strong> <span className="text-[#f0592a] font-medium">[Khu phố 6, phường Linh Trung, TP.HCM]</span></li>
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