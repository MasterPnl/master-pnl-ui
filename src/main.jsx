import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './reset.css'
import {RouterProvider} from "react-router-dom";
import {Router} from "./utils/router";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={Router}/>
    </StrictMode>,
)
