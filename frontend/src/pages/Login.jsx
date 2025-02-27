import { useLocation, useParams, useSearchParams } from "react-router-dom";
import Forms from "../components/Forms";


const Login = () => {
  const location = useLocation();
  console.log(location);
  return (
    <div className="login">
      <Forms/>
    </div>
  );
}

export default Login;