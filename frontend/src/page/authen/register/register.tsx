import React from 'react';
import { Form, Input, Row, Col, Card, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CreateUser } from '../../../services/https/';
import './register.css'; 

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: any) => {
    
        try {
            const res = await CreateUser(values);
            console.log("API Response:", res); 
    
            if (res.status === 201) {
                messageApi.success("สมัครสมาชิกสำเร็จ!");
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else if (res.status === 409) {
                messageApi.error(res.data.error || " Username or email is already taken.");
            } else {
                messageApi.error(res.data.error || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
            }
        } catch (error) {
            messageApi.error(" การเชื่อมต่อ API ล้มเหลว");
        }
    };
    
    
    

    return (
        <>
            {contextHolder}
            <div className="container">
                <Card className="card-register" style={{ width: '100%', maxWidth: 600 }}>
                    <h1 className="title">สมัครสมาชิก</h1>
                    <Form
                        name="register"
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="ชื่อผู้ใช้"
                                    name="username"
                                    rules={[{ required: true, message: 'กรุณากรอกชื่อผู้ใช้!' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="รหัสผ่าน"
                                    name="password"
                                    rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน!' }]}
                                >
                                    <Input.Password />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            label="อีเมล"
                            name="email"
                            rules={[
                                { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง!' },
                                { required: true, message: 'กรุณากรอกอีเมล!' }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="submit-btn">
                                สมัครสมาชิก
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </>
    );
};

export default Register;
