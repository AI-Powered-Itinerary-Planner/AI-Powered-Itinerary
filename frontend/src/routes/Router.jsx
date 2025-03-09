import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Plantrip from "../pages/Plantrip";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
        errorElement: <div>404 Not Found</div>
    },
    {
        path:"/login",
        element:<Login/>,
        errorElement: <div>404 Not Found</div>
    },
    {
        path:'/register',
        element:<Register/>,
        errorElement:<div>404 Not Found</div>
    },
    {
        path:'/plantrip',
        element:<Plantrip/>,
        errorElement:<div>404 Not Found</div>
    }
]);

export default router;
