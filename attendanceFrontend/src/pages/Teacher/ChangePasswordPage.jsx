import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ChangePasswordPage.css";

const ChangePasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const teacherId = location.state?.teacherId;

  useEffect(() => {
    if (!teacherId) {
      alert("Unauthorized access");
      navigate("/login");
    }
  }, [teacherId, navigate]);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teacherId, newPassword }),
      });

      const data = await response.json();


      if (response.ok) {
        alert(data.message);
        navigate("/");
      } else {
        alert(data.error || "Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="change-password-container">
      <form className="change-password-form" onSubmit={handleChangePassword}>
        <h2>Set New Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          required
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
