import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const baseURL = "http://localhost:5000"; // ✅ backend server
  const url = isLogin ? `${baseURL}/api/auth/login` : `${baseURL}/api/auth/signup`;

  const BASE_URL = process.env.REACT_APP_API_URL;

try {
  const res = await axios.post(`${BASE_URL}/api/auth/login`, formData);
  localStorage.setItem("token", res.data.token);
  navigate("/tasks");
} catch (err) {
    alert(err.response?.data?.message || "Something went wrong");
  }
};


  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="text-center mb-4">{isLogin ? "Login" : "Signup"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
          </div>
        )}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange}  autoComplete="current-password" required />
        </div>
        <button type="submit" className="btn btn-primary w-100 mb-3">
          {isLogin ? "Login" : "Signup"}
        </button>
        <button type="button" className="btn btn-outline-secondary w-100" onClick={toggleMode}>
          {isLogin ? "Don't have an account? Signup" : "Already have an account? Login"}
        </button>
      </form>
    </div>
  );
};

export default Auth;
