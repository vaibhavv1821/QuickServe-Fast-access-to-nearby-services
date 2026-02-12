import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const styles = {
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
      padding: "20px"
    },
    card: {
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      cursor: "pointer"
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.grid}>
      {user.role === "user" && (
        <>
          <div style={styles.card} onClick={() => navigate("/search")}>
            <h3>🔍 Search Providers</h3>
          </div>

          <div style={styles.card} onClick={() => navigate("/my-bookings")}>
            <h3>📅 My Bookings</h3>
          </div>
        </>
      )}

      {user.role === "provider" && (
        <>
          <div style={styles.card} onClick={() => navigate("/provider-profile")}>
            <h3>👤 My Profile</h3>
          </div>
        </>
      )}

      {user.role === "admin" && (
        <>
          <div style={styles.card} onClick={() => navigate("/admin/providers")}>
            <h3>✅ Approve Providers</h3>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
