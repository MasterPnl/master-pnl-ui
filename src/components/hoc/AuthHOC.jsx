import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import routes from "@/utils/routes.js";

const AuthHOC = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const navigate = useNavigate();

        useEffect(() => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate(routes.LOGIN.path, { replace: true });
            }
        }, [navigate]);

        return localStorage.getItem("token") ? <WrappedComponent {...props} /> : null;
    };

    AuthComponent.displayName = `AuthHOC(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

    return AuthComponent;
};

export default AuthHOC;
