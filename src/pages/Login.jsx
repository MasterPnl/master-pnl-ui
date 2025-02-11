import {useState} from "react";
import {Alert, Button, Card, Form, Input, Layout, Typography} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import routes from "@/utils/routes.js";
import {AuthService} from "@/services/auth.service.js";
// import logo from "/logo.png"; // Adjust the path to your logo image

const {Title} = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const onFinish = async (values) => {
        setLoading(true);
        const {username, password} = values;
        AuthService.login({username, password}).then(res => {
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
                navigate(routes.ROOT.path);
            }
        }).finally(() => {
            setLoading(false);
        });
    };

    return (<Layout
        style={{
            display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", padding: "0 20px",
        }}
    >
        <Card
            style={{
                width: "100%", maxWidth: "400px", textAlign: "center", padding: "20px",
            }}
        >
            {/*<Image src={logo} alt="Logo" style={{height: "80px", marginBottom: "20px"}}/>*/}
            <Title level={3} style={{marginBottom: "24px"}}>
                Giriş Yap
            </Title>

            <Form
                name="login"
                initialValues={{remember: true}}
                onFinish={onFinish}
                layout="vertical"
                style={{textAlign: "left"}}
            >
                <Form.Item
                    name="username"
                    rules={[{required: true, message: 'Kullanıcı Adı'},]}
                >
                    <Input prefix={<UserOutlined/>} placeholder="Kullanıcı Adı"/>
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{required: true, message: "Şifre"}]}
                >
                    <Input.Password prefix={<LockOutlined/>} placeholder="Şifre"/>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Giriş
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    </Layout>);
};

export default Login;
