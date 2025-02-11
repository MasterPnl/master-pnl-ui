import {Button, Layout, Menu} from "antd";
import {
    BarChartOutlined,
    DashboardOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PicCenterOutlined,
    UserOutlined,
    UserSwitchOutlined,
} from "@ant-design/icons";
import {useEffect, useState} from "react";
import routes from "../../utils/routes.js";
import {useNavigate} from "react-router-dom";

const {Sider} = Layout;
import {jwtDecode} from "jwt-decode"
import useLocalStorageListener from "@/hooks/useLocalStorageListener.js";
import {getDecodedToken} from "@/utils/helpers.js";
import {AuthService} from "@/services/auth.service.js";

const userMenu = [{
    icon: <DashboardOutlined/>, label: "İlan Yönetimi", key: routes.LISTING.path,
}, {
    icon: <BarChartOutlined/>, label: "Raporlar", key: routes.REPORT.path,
}];

const adminMenu = [{
    icon: <UserOutlined/>, label: "Kullanıcı Yönetimi", key: routes.USER_MANAGEMENT.path,
}, {
    icon: <PicCenterOutlined/>, label: "Panel Yönetimi", key: routes.PANEL_MANAGEMENT.path,
}, {
    icon: <UserSwitchOutlined/>, label: "Kullanıcı Panel Yönetimi", key: routes.USER_PANEL_MANAGEMENT.path,
}, {
    icon: <BarChartOutlined/>, label: "Raporlar", key: routes.REPORT.path,
}];

const DrawerMenu = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const [menu, setMenu] = useState(null)
    const token = useLocalStorageListener('token');

    useEffect(() => {
        if (!token) return;

        getDecodedToken(token)
            .then(decoded => {
                setMenu(decoded.isAdmin ? adminMenu : userMenu);
                if (decoded.isAdmin) {
                    navigate(routes.USER_MANAGEMENT.path);
                } else {
                    navigate(routes.LISTING.path);
                }
            })
            .catch(() => {
                AuthService.logout().then(() => {
                    localStorage.clear();
                    navigate(routes.LOGIN.path);
                })
            });


    }, [token]);

    return (<Sider trigger={null} collapsible collapsed={collapsed}>
        <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
            onClick={() => setCollapsed(!collapsed)}
            style={{
                fontSize: "16px", width: 64, height: 64, color: "#fff",
            }}
        />
        <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={menu}
            onClick={({key}) => {
                navigate(key);
            }}
        />
    </Sider>);
};

export default DrawerMenu;
