import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User as UserIcon, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

export default function AuthPage() {
    const [isRegisterActive, setIsRegisterActive] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const navigate = useNavigate();

    // 1. STATE CHO FORM ĐĂNG KÝ
    const [regRole, setRegRole] = useState('designer');
    const [regFullName, setRegFullName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');

    // 2. STATE CHO FORM ĐĂNG NHẬP

    const [logEmail, setLogEmail] = useState('');
    const [logPassword, setLogPassword] = useState('');

    // State chung để hiển thị thông báo
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isLoading, setIsLoading] = useState(false);


    // HÀM XỬ LÝ ĐĂNG KÝ (Gọi API /register)

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!regFullName || !regEmail || !regPassword) {
            setMessage({ type: 'error', text: 'Vui lòng điền đầy đủ thông tin!' });
            return;
        }
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: regFullName,
                    email: regEmail,
                    password: regPassword,
                    role: regRole // "designer" hoặc "producer"
                })
            });

            const data = await response.text();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Đã gửi mã OTP! Đang chuyển hướng...' });
                setTimeout(() => {
                    navigate('/verify_email', { state: { email: regEmail } });
                }, 1000);

            } else {
                setMessage({ type: 'error', text: data || 'Đăng ký thất bại' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Không thể kết nối đến server.' });
        } finally {
            setIsLoading(false);
        }
    };

    // HÀM XỬ LÝ ĐĂNG NHẬP (Gọi API /login)
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' }); // Xóa thông báo cũ

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: logEmail,
                    password: logPassword
                })
            });
            const textData = await response.text();
            let data;

            try {
                data = JSON.parse(textData);
            } catch (parseError) {
                data = { message: 'Lỗi máy chủ hoặc định dạng dữ liệu không hợp lệ.' };
            }

            if (response.ok) {
                setMessage({ type: 'success', text: 'Đăng nhập thành công! Đang chuyển hướng...' });

                localStorage.setItem('userId', String(data.userId));
                localStorage.setItem('userName', data.fullName);
                localStorage.setItem('userEmail', data.email);
                localStorage.setItem('userRole', data.role);

                setTimeout(() => {
                    if (data.role === 'ADMIN') {
                        navigate('/admin');
                    } else {
                        navigate('/');
                    }
                }, 1000);
            } else {
                // 3. Hiển thị thông báo lỗi an toàn (chỉ lấy chuỗi text)
                setMessage({ type: 'error', text: data.message || 'Sai tài khoản hoặc mật khẩu' });
            }

        } catch (error) {
            // Lỗi này xảy ra khi mất mạng hoặc không gọi được Backend
            console.error("Lỗi đăng nhập:", error);
            setMessage({ type: 'error', text: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setIsLoading(true);
        try {
            // Gửi Token lấy được từ Google xuống Spring Boot
            const response = await fetch('http://localhost:8080/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: credentialResponse.credential })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Đăng nhập Google thành công!' });

                // Lưu trạng thái y như đăng nhập thường
                localStorage.setItem('userName', data.fullName);
                localStorage.setItem('userEmail', data.email);
                localStorage.setItem('userRole', data.role);

                setTimeout(() => {
                    const role = data.role ? data.role.toUpperCase() : '';
                    if (role === 'ADMIN' || role === 'ROLE_ADMIN') {
                        navigate('/admin');
                    } else {
                        navigate('/');
                    }
                }, 1000);
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            console.error("Lỗi Google Login:", error);
            setMessage({ type: 'error', text: 'Không thể kết nối đến máy chủ.' });
        } finally {
            setIsLoading(false);
        }
    };

    const togglePanel = (isActive) => {
        setIsRegisterActive(isActive);
        setMessage({ type: '', text: '' });
    };

    return (
        <div className="w-full min-h-screen bg-transparent flex items-center justify-center p-4 font-sans">
            <div className="relative w-full max-w-[1000px] min-h-[700px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/60 overflow-hidden">

                {/* KHU VỰC FORM ĐĂNG KÝ */}
                <div className={`absolute top-0 left-0 h-full w-1/2 p-8 md:p-12 transition-all duration-700 ease-in-out z-10 flex flex-col justify-center bg-transparent
                    ${isRegisterActive ? 'translate-x-0 opacity-100' : '-translate-x-[100%] opacity-0 pointer-events-none'}`}>

                    <h1 className="text-2xl md:text-3xl font-medium tracking-tight mb-2 text-zinc-950 text-center">Tạo tài khoản</h1>
                    <p className="text-zinc-500 mb-6 text-sm text-center">Tham gia thị trường thiết kế trang phục sáng tạo.</p>

                    {/* Hiển thị thông báo (nếu có và đang ở tab Đăng ký) */}
                    {message.text && isRegisterActive && (
                        <div className={`mb-4 p-3 rounded-lg text-sm text-center ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {message.text}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleRegister}>
                        {/* Khu vực Chọn Role */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-zinc-900">Vai trò của bạn</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button type="button" onClick={() => setRegRole('designer')}
                                        className={`text-left p-3 rounded-xl border transition-all relative ${
                                            regRole === 'designer' ? 'border-[#f0592a] bg-[#f0592a]/5 ring-1 ring-[#f0592a]/20' : 'border-zinc-300 hover:border-[#f0592a]/50 bg-transparent'
                                        }`}>
                                    <h3 className={`font-semibold text-[13px] mb-1 ${regRole === 'designer' ? 'text-zinc-900' : 'text-zinc-700'}`}>Tôi là Designer</h3>
                                    {regRole === 'designer' && <div className="absolute top-3 right-3 w-3.5 h-3.5 rounded-full bg-[#f0592a] flex items-center justify-center shadow-sm"><Check className="w-2 h-2 text-white" strokeWidth={3} /></div>}
                                </button>
                                <button type="button" onClick={() => setRegRole('producer')}
                                        className={`text-left p-3 rounded-xl border transition-all relative ${
                                            regRole === 'producer' ? 'border-[#f0592a] bg-[#f0592a]/5 ring-1 ring-[#f0592a]/20' : 'border-zinc-300 hover:border-[#f0592a]/50 bg-transparent'
                                        }`}>
                                    <h3 className={`font-semibold text-[13px] mb-1 ${regRole === 'producer' ? 'text-zinc-900' : 'text-zinc-700'}`}>Tôi là Producer</h3>
                                    {regRole === 'producer' && <div className="absolute top-3 right-3 w-3.5 h-3.5 rounded-full bg-[#f0592a] flex items-center justify-center shadow-sm"><Check className="w-2 h-2 text-white" strokeWidth={3} /></div>}
                                </button>
                            </div>
                        </div>

                        {/* Họ tên & Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-900 block">Họ và tên</label>
                                <div className="relative">
                                    <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                    <input type="text" value={regFullName} onChange={(e) => setRegFullName(e.target.value)} placeholder="Tên của bạn"
                                           className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-sm text-zinc-900 bg-transparent" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-900 block">Email</label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                    <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="name@email.com"
                                           className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-sm text-zinc-900 bg-transparent" />
                                </div>
                            </div>
                        </div>

                        {/* Mật khẩu */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-900 block">Mật khẩu</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input type={showRegisterPassword ? "text" : "password"} value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Tối thiểu 8 ký tự"
                                       className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-sm text-zinc-900 bg-transparent" />
                                <button type="button" onClick={() => setShowRegisterPassword(!showRegisterPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors">
                                    {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <label className="flex items-start gap-2 cursor-pointer group">
                                <input type="checkbox" defaultChecked className="w-3.5 h-3.5 mt-0.5 rounded border-zinc-400 text-[#f0592a] focus:ring-[#f0592a] accent-[#f0592a] bg-transparent" />
                                <span className="text-[12px] font-medium text-zinc-700 leading-tight">
                                    Tôi đồng ý với <a href="/term_service" className="text-[#f0592a] hover:underline">Điều khoản</a> và <a href="#" className="text-[#f0592a] hover:underline">Chính sách bảo mật</a>.
                                </span>
                            </label>
                        </div>

                        {/* Nút Đăng ký */}
                        <button type="submit" disabled={isLoading} className="w-full bg-[#f0592a] hover:bg-[#d94a1f] disabled:opacity-70 text-white font-medium py-3 rounded-lg transition-all active:scale-[0.98] shadow-sm mt-4 text-sm">
                            {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                        </button>
                    </form>
                </div>

                {/* KHU VỰC FORM ĐĂNG NHẬP */}
                <div className={`absolute top-0 right-0 h-full w-1/2 p-8 md:p-14 transition-all duration-700 ease-in-out z-10 flex flex-col justify-center bg-transparent
                    ${!isRegisterActive ? 'translate-x-0 opacity-100' : 'translate-x-[100%] opacity-0 pointer-events-none'}`}>

                    <h1 className="text-3xl font-medium tracking-tight mb-2 text-zinc-950 text-center">Đăng nhập</h1>
                    <p className="text-zinc-500 mb-8 text-sm text-center">Chào mừng bạn quay trở lại với Atelier</p>

                    {/* Hiển thị thông báo (nếu có và đang ở tab Đăng nhập) */}
                    {message.text && !isRegisterActive && (
                        <div className={`mb-4 p-3 rounded-lg text-sm text-center ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {message.text}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleLogin}>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-zinc-900 block">Email</label>
                            <div className="relative">
                                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input type="email" value={logEmail} onChange={(e) => setLogEmail(e.target.value)} placeholder="Email của bạn"
                                       className="w-full pl-11 pr-4 py-3 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-sm text-zinc-900 bg-transparent" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-zinc-900 block">Mật khẩu</label>
                            <div className="relative">
                                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input type={showLoginPassword ? "text" : "password"} value={logPassword} onChange={(e) => setLogPassword(e.target.value)} placeholder="Nhập mật khẩu"
                                       className="w-full pl-11 pr-11 py-3 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#f0592a]/20 focus:border-[#f0592a] transition-all text-sm text-zinc-900 bg-transparent" />
                                <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors">
                                    {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-zinc-400 text-[#f0592a] focus:ring-[#f0592a] accent-[#f0592a] bg-transparent" />
                                <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900 transition-colors">Ghi nhớ</span>
                            </label>
                            <a href="/forgot_password" className="text-sm font-medium text-zinc-600 hover:text-[#f0592a] transition-colors">
                                Quên mật khẩu?
                            </a>
                        </div>

                        {/* Nút Đăng nhập thường */}
                        <button type="submit" disabled={isLoading} className="w-full bg-[#f0592a] hover:bg-[#d94a1f] disabled:opacity-70 text-white font-medium py-3 rounded-lg transition-all active:scale-[0.98] shadow-sm mt-4 text-sm">
                            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                        </button>

                        <div className="flex items-center py-4 mt-2">
                            <div className="flex-grow border-t border-zinc-200"></div>
                            <span className="px-4 text-[10px] uppercase tracking-widest font-bold text-zinc-400">HOẶC</span>
                            <div className="flex-grow border-t border-zinc-200"></div>
                        </div>

                        {/* Nút Google Chính Chủ */}
                        <div className="flex justify-center w-full">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => {
                                    setMessage({ type: 'error', text: 'Đăng nhập bằng Google thất bại.' });
                                }}
                                theme="outline"
                                size="large"
                                shape="rectangular"
                                text="signin_with"
                                width="400"
                            />
                        </div>
                    </form>
                </div>

                {/* KHU VỰC CHUYỂN TAB (SLIDING PANELS) */}
                <div className={`absolute top-0 left-0 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-50
                    ${isRegisterActive ? 'translate-x-full' : 'translate-x-0'}`}>
                    <div className={`absolute top-0 left-0 w-[200%] h-full bg-gradient-to-br from-[#f0592a] to-[#d94a1f] text-white transition-transform duration-700 ease-in-out
                        ${isRegisterActive ? '-translate-x-1/2' : 'translate-x-0'}`}>

                        <div className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center p-12 text-center transition-transform duration-700 ease-in-out
                            ${!isRegisterActive ? 'translate-x-0' : '-translate-x-[20%]'}`}>
                            <h2 className="text-3xl font-bold mb-4">Chào bạn mới!</h2>
                            <p className="text-white/90 mb-8 font-medium leading-relaxed text-sm">
                                Tham gia Atelier ngay hôm nay để bắt đầu hành trình sáng tạo và kinh doanh các sản phẩm thời trang.
                            </p>
                            <button onClick={() => togglePanel(true)} className="bg-transparent border-2 border-white text-white font-medium py-3 px-12 rounded-full hover:bg-white hover:text-[#f0592a] transition-all active:scale-95 text-sm">
                                Tạo tài khoản
                            </button>
                        </div>

                        <div className={`absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center p-12 text-center transition-transform duration-700 ease-in-out
                            ${isRegisterActive ? 'translate-x-0' : 'translate-x-[20%]'}`}>
                            <h2 className="text-3xl font-bold mb-4">Mừng bạn trở lại!</h2>
                            <p className="text-white/90 mb-8 font-medium leading-relaxed text-sm">
                                Để duy trì kết nối với không gian làm việc của bạn, vui lòng đăng nhập bằng tài khoản cá nhân.
                            </p>
                            <button onClick={() => togglePanel(false)} className="bg-transparent border-2 border-white text-white font-medium py-3 px-12 rounded-full hover:bg-white hover:text-[#f0592a] transition-all active:scale-95 text-sm">
                                Đăng nhập
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}