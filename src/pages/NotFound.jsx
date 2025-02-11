import {Button, Result} from 'antd';
import {useNavigate} from 'react-router-dom';
import routes from "@/utils/routes.js";

const NotFound = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate(routes.ROOT);
    };

    return (
        <Result
            status="404"
            title="404"
            subTitle="Üzgünüz, aradığınız sayfa bulunamadı."
            extra={<Button type="primary" onClick={goHome}>Back Home</Button>}
        />
    );
};

export default NotFound;
