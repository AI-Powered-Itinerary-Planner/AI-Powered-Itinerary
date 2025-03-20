import axios from "axios";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom"
import GoogleAuth from "./GoogleAuth";  


const Forms = () => {
    const location = useLocation();
    const isLogin = location.pathname === "/login";
    const {register,handleSubmit,formState:{errors}} = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        console.log(data.username);
        if (!isLogin) {
            try {
                const response = await fetch('http://localhost:3000/users/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: data.username,
                        email: data.email,
                        password: data.password,
                    }),
                });
        
                const result = await response.json();
        
                if (!response.ok) {
                    // If the response was not successful, handle the error
                    toast.error(result.error || "An error occurred during registration");
                } else {
                    toast.success("User registered successfully");
                    const userData = {
                        name: result.name,
                        email: result.email,
                        login: false
                    }
                    navigate("/home", {state : {user: userData}});
                }
            } catch (error) {
                console.log(error);
                toast.error("An error occurred during registration");
            }
        }
        else {
            try{
            const response = await fetch('http://localhost:3000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Ensure the backend understands this is JSON
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            })
            const result = await response.json();
            if (!response.ok) {
                toast.error(result.error || "An error occurred during login");
            } else {
                toast.success("Login successful!");
                const userData = {
                    name: result.user.name,
                    email: result.user.email,
                    login: true,
                };
                navigate("/home", { state: { user: userData } });
                // Redirect user or store authentication token here
            } 
            }catch (error) {
                console.error('Error during login:', error);
                toast.error("An error occurred while trying to log in.");
            }
        }
    }
    
    return (
        
        <div className="forms">
            <h1>{isLogin ? "Login" : "Register"}</h1>
            <form onSubmit ={handleSubmit(onSubmit)}> 
                <input {...register("email",{
                    required:"Email is required",
                    validate : (value) => value.includes("@") || "Email must include @"
                })} type="text" id="email" placeholder="Enter Email" />
                {
                    errors.email && <p>{errors.email.message}</p>
                }
                <input{...register("username",{
                    required:"Username is required",
                    minLength:{value:3,message:"Username must be at least 3 characters long"},
                    maxLength:{value:20,message:"Username must be at most 20 characters long"}
                })} type="text" id="username" placeholder="Enter Username" />
                {
                    errors.username && <p>{errors.username.message}</p>
                }
                <input{...register("password",{
                    requird:"Password is required",
                    validate:(value) => value.length >= 8 || "Password must be at least 8 characters long",
                    pattern:{
                        value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message:"Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
                    }
                })} type="password" id="password" placeholder="Enter Password" />
                {
                    errors.password && <p>{errors.password.message}</p>
                }
                
                {!isLogin && (
                    <input {...register("confirmpassword",{
                        required:"Confirm Password is required"
                    })}type="password" placeholder="Confirm Password" id="confirmpassword" />
                )}
                <button type="Submit">Submit</button>

                {/* Google Login Button */}
                <GoogleAuth /> 

                {isLogin ? ( 
                    <Link to='/register'><h3>New To Voyage AI?</h3></Link>) : (<Link to='/login'><h3>Have An Account?</h3></Link>)}
            </form>
        </div>
    )
}
export default Forms