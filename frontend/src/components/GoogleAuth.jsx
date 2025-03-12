import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";  
import { useNavigate } from "react-router-dom";  


const GoogleAuth = () => {
  const navigate = useNavigate();  

  const handleSuccess = (credentialResponse) => {
    console.log("Google Login Success:", credentialResponse);

    // Decode JWT to get user details
    const decoded = jwtDecode(credentialResponse.credential);
    console.log("Decoded Google User Data:", decoded);
    console.log("User Name:", decoded.name);
    console.log("User Email:", decoded.email);

    navigate("/home");  
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
