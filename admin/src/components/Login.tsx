// Register.tsx
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { api } from "../Api";
const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email !== "" && password !== "") {
      try {
        const res = await axios.post(
          `${api}/login`,
          { email, password },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (res.data.code === 404) {
          toast("User Already exists");
        } else if (res.data.code === 401) {
          toast("Invalid password");
        } else if (res.data.code === 200) {
          navigate("/");
          toast("Login successfully");
          window.localStorage.setItem("TOKEN", res.data.token);
          window.localStorage.setItem("USERNAME", res.data.username);
          window.localStorage.setItem("EMAIL", res.data.email);
          window.localStorage.setItem("PROFILEPHOTO", res.data.profileImg);
          window.localStorage.setItem("USER_ID", res.data.userId);
        }
      } catch (error) {
        console.log(error);
        toast.error(`error: ${error}`);
      }
    } else {
      toast("All Feild Are Required");
    }
  };

  return (
    <div className="register-container">
      <motion.div
        className="register-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
          </div>
          <Link to={"/register"}>Already have an account? Sign Up</Link>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
