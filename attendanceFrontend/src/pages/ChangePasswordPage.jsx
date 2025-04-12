import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ChangePasswordPage.css";

const ChangePasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/teacher/change-password/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Password updated successfully. Please login again.");
        navigate("/"); // Redirect to login page
      } else {
        alert(data.message || "Password update failed!");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="change-password-container">
      <form className="change-password-form" onSubmit={handleChangePassword}>
        <h2>Change Your Password</h2>
        <input
          type="password"
          placeholder="New Password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
