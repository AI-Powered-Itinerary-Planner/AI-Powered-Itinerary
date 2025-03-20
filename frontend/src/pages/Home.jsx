import { Navigate, useLocation, useNavigate } from "react-router-dom";

const Home = () => {
    const location = useLocation();
    const userData = location.state;
    const navigate = useNavigate();
    console.log("User Data:", userData?.user);
    const isLogin  = userData?.user?.login;
    const isRegister  = userData?.user?.login === false;
    
    return (
        <div>
            {isRegister? (
        <h1>Welcome {userData?.user?.name} Lets get started on your first Adventure!</h1>
            ) : isLogin? (
        <h1>Welcome Back, {userData?.user?.name}</h1>
            ) : (
                <>
                <h1>Welcome! Please login or register to get started</h1>
                <button onClick={() => navigate('/register')}>Register</button>
                <button onClick={() => navigate('/login')}>Login</button>
                
                </>
            )
        }
            {(isLogin || isRegister) && (
                <>
                <button onClick={() => navigate('/explore')}>Explore</button>
                <button onClick={() => navigate('/plantrip')}>Plan Trip</button>
                <button onClick={() => navigate('/saveditineraries')}>Saved Itineraries</button>
                <button onClick={() => navigate('/settings')}>Settings</button>
                </>
            )}
        </div>
        
    )
}

export default Home;