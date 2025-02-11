import {Button, Layout, Typography} from "antd";
import {useNavigate} from "react-router-dom";
import {LogoutOutlined} from "@ant-design/icons";
import routes from "@/utils/routes.js";
import {AuthService} from "@/services/auth.service.js";

const {Header} = Layout;

const Nav = () => {
    const navigate = useNavigate();

    const logout = async () => {
        AuthService.logout().then(() => {
            localStorage.clear();
            navigate(routes.LOGIN.path);
        });
    };

    return (
        <Header
            style={{
                background: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 20px",
            }}
        >
            <div style={{display: "flex", alignItems: "center"}}>
                <Typography.Title
                    level={4}
                    style={{
                        marginBottom: 0,
                        marginLeft: "20px",
                    }}
                >Master Pnl</Typography.Title>
            </div>
            <Button type="default" onClick={logout} icon={<LogoutOutlined/>}>
                Çıkış
            </Button>
        </Header>
    );
};

export default Nav;
