import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        // Check if first login
        if (data.firstLogin) {
          // If first login, redirect to change password page
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);
          localStorage.setItem("id", data.teacherId);

          navigate("/change-password", {
            state: { teacherId: data.teacherId },
          });
        } else {
          // Otherwise, handle normal login and redirect accordingly
          const { role, teacherId } = data.teacher;

          // Store role and ID in localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", role);
          localStorage.setItem("id", teacherId);

          if (role === "admin") {
            navigate("/admin-dashboard");
          } else if (role === "teacher") {
            navigate("/teacher-dashboard");
          }
        }
      } else {
        alert(data.message || "Login failed!");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
