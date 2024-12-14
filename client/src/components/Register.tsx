// Register.tsx
import { ChangeEvent, FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

import { api } from "../Api";
const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.size < 5 * 1024 * 1024) {
      setFile(selectedFile);
    } else {
      toast.error("File size should be less than 5MB");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
    if (file) {
      formData.append("file", file);
    }

    if (username !== "" && password !== "" && email !== "" && file !== null) {
      try {
        const res = await axios.post(`${api}/register`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data.code === 200) {
          navigate("/login");
          toast(`Register successfully`, {
            duration: 2000,
            position: "bottom-right",
            icon: "👏",
            iconTheme: {
              primary: "#000",
              secondary: "#fff",
            },
            ariaProps: {
              role: "status",
              "aria-live": "polite",
            },
          });
        } else if (res.data.code === 409) {

          toast(`User Already exists`, {
            duration: 2000,
            position: "bottom-right",
            icon: "👏",
            iconTheme: {
              primary: "#000",
              secondary: "#fff",
            },
            ariaProps: {
              role: "status",
              "aria-live": "polite",
            },
          });

        }
      } catch (error) {
        console.log(error);
        toast(`${error}`, {
          duration: 2000,
          position: "bottom-right",
          icon: "👏",
          iconTheme: {
            primary: "#000",
            secondary: "#fff",
          },
          ariaProps: {
            role: "status",
            "aria-live": "polite",
          },
        });
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
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>Username</label>
          </div>

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

          <div className="input-group">
            <input type="file" onChange={handleFileChange} />
            <label>Upload File</label>
          </div>

          <Link to={"/login"}>Already have an account? Login</Link>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Register
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
