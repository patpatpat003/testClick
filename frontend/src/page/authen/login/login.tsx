import React, { useState } from 'react';
import '../login/login.css';
import { useNavigate } from 'react-router-dom';
import { SignIn } from '../../../services/https/';
import { message } from 'antd'; 
import { SignInInterface } from '../../../interfaces/IUser';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const Signup = () => {
        navigate('/register');
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const values: SignInInterface = { email, password };

        try {
            let res = await SignIn(values);
            if (res.status === 200) {
                messageApi.success("Sign-in successful");

                localStorage.setItem("isLogin", "true");
                localStorage.setItem("page", "kanban");
                localStorage.setItem("token_type", res.data.token_type);
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("id", res.data.id);

                setTimeout(() => {
                    navigate('/');
                    setTimeout(() => {
                        window.location.reload(); 
                    }, 500); 
                }, 2000);
            } else {
                messageApi.error(res.data.error);
            }
        } catch (error) {
            messageApi.error('Failed to sign in');
        }
    };

    return (
        <>
            {contextHolder}
            <div className="container">
                <h1 className="title">เข้าสู่ระบบ</h1>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>อีเมล</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>รหัสผ่าน</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="button-group">
                        <button type="submit" className="login-btn">เข้าสู่ระบบ</button>
                        <button type="button" className="signup-btn" onClick={Signup}>สมัครสมาชิก</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Login;