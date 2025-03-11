import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Plantrip from "../pages/Plantrip";
import Layout from "../components/Layout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />, 
        errorElement: <div>404 Not Found</div>,
        children: [
            { path: "/home", element: <Home /> },
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
            { path: "/plantrip", element: <Plantrip /> }
            
        ],
    },

]);

export default router;
