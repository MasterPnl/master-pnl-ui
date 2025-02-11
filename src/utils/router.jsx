import {createBrowserRouter} from "react-router-dom";
import routes from "@/utils/routes.js";
import App from "@/App.jsx";
import UserManagement from "@/pages/admin/UserManagement.jsx";
import PanelManagement from "@/pages/admin/PanelManagement.jsx";
import Login from "@/pages/Login.jsx";
import NotFound from "@/pages/NotFound.jsx";
import Listing from "@/pages/user/Listing.jsx";
import UserPanelManagement from "@/pages/admin/UserPanelManagement.jsx";

function UserReport() {
    return null;
}

export const Router = createBrowserRouter([
    {
        path: routes.LOGIN.path,
        element: <Login/>,
    },
    {
        path: routes.NOT_FOUND.path,
        element: <NotFound/>,
    },
    {
        path: routes.ROOT.path,
        element: <App/>,
        children: [
            {
                path: routes.USER_MANAGEMENT.path,
                element: <UserManagement/>,
            },
            {
                path: routes.PANEL_MANAGEMENT.path,
                element: <PanelManagement/>,
            },
            {
                path: routes.USER_PANEL_MANAGEMENT.path,
                element: <UserPanelManagement/>,
            },
            {
                path: routes.LISTING.path,
                element: <Listing/>,
            },
            {
                path: routes.REPORT.path,
                element: <UserReport/>,
            }
        ],
    },
]);
