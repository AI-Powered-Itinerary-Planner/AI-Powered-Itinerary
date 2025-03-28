import React, { useContext } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";  
import { useLocation, useNavigate } from "react-router-dom";  
import { UserContext } from "../Context/UserContext";


const GoogleAuth = () => {
  const navigate = useNavigate();  
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const {setUser} = useContext(UserContext); 

  const handleSuccess = async (credentialResponse) => {
    console.log("Google Login Success:", credentialResponse);

    // Decode JWT to get user details
    const decoded = jwtDecode(credentialResponse.credential);
    console.log("Decoded Google User Data:", decoded);
    console.log("User Name:", decoded.name);
    console.log("User Email:", decoded.email);
    try {
      const response = await fetch("http://localhost:3001/auth/google", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: decoded.name,
          email: decoded.email,
          sub: decoded.sub, // Google unique ID
        })
      });
  
      const data = await response.json();
      console.log("Backend Response:", data);
  
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser({ 
          id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        isNewUser: !isLogin,
        });
  
        isLogin ? navigate("/home") : navigate("/profileCreation");  
      } else {
        console.error("Google authentication failed:", data.message);
      }
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
  };

  const handleFailure = () => {
    console.error("Google Login Failed");
  };

  return (
    <GoogleOAuthProvider clientId="81270836381-l781r2e2kcd5ecg9d9ae3ke51tii106c.apps.googleusercontent.com">
      <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
