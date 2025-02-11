import {Layout} from "antd";
import DrawerMenu from "./components/layout/DrawerMenu.jsx";
import Nav from "./components/layout/Nav.jsx";
import {Outlet} from "react-router-dom";
import AuthHOC from "@/components/hoc/AuthHOC.jsx";

const {Content} = Layout;

function App() {
    return (
        <Layout style={{
            minHeight: '100vh',
        }}>
            <Nav/>
            <Layout>
                <DrawerMenu/>
                <Content style={{
                    padding: 16
                }}>
                    <Outlet/>
                </Content>
            </Layout>
        </Layout>)
}

export default AuthHOC(App);
