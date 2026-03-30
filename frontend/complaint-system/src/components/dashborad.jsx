import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:3000";
const CATEGORIES = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "cleanliness", label: "Cleanliness" },
  { value: "water", label: "Water Supply" },
  { value: "maintenance", label: "Maintenance" },
  { value: "other", label: "Other" },
];

function DashBoard() {
  const [username, setUsername] = useState("");
  const [studentHostel, setStudentHostel] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [category, setCategory] = useState("plumbing");
  const [urgent, setUrgent] = useState(false);

  const navigate = useNavigate();

  function capitalizeFirstLetter(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    async function fetchData() {
      try {
        const userRes = await axios.get(`${API}/me`, {
          headers: { authorization: token },
        });
        setUsername(userRes.data.username);
        setStudentHostel(userRes.data.hostel || "");

        const compRes = await axios.get(`${API}/get-complaints`, {
          headers: { authorization: token },
        });
        setComplaints(compRes.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [navigate]);

  async function submitComplaint(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${API}/new-complaint`,
        {
          title,
          room_no: roomNo,
          category,
          urgent,
        },
        { headers: { authorization: token } }
      );
      setComplaints([res.data, ...complaints]);
      setTitle("");
      setRoomNo("");
      setCategory("plumbing");
      setUrgent(false);
      setShowForm(false);
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg) alert(msg);
      else console.error(err);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  }

  const pendingComplaints = complaints.filter((item) => !item.done);

  function getCategoryLabel(val) {
    return CATEGORIES.find((c) => c.value === val)?.label || val;
  }

  return (
    <div className="dashboard">
      <h1 className="welcome">Welcome, {capitalizeFirstLetter(username)}</h1>
      <p className="dashboard-sub">Student Dashboard • Manage your complaints</p>

      <div className="dashboard-container">
        <div className="card quick-actions">
          <h2>Quick Actions</h2>
          <div className="quick-actions-content">
            <button
              className="btn primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "✖ Close Form" : "✏️ New Complaint"}
            </button>

            {showForm && (
              <div className="dropdown-form">
                {!studentHostel && (
                  <p className="form-hint" style={{ color: "var(--danger, #c00)" }}>
                    Your hostel is not set. Please contact admin or create a new account with your hostel.
                  </p>
                )}
                <form onSubmit={submitComplaint}>
                  <div className="form-group">
                    <label>Complaint Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Water leakage in bathroom"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {studentHostel && (
                    <p className="form-hint">Complaint for: <strong>{studentHostel}</strong></p>
                  )}
                  <div className="form-group">
                    <label>Room Number</label>
                    <input
                      type="number"
                      placeholder="e.g. 101"
                      value={roomNo}
                      onChange={(e) => setRoomNo(e.target.value)}
                      required
                    />
                  </div>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={urgent}
                      onChange={(e) => setUrgent(e.target.checked)}
                    />
                    Mark as urgent
                  </label>
                  <button type="submit" className="btn primary" disabled={!studentHostel}>
                    Submit Complaint
                  </button>
                </form>
              </div>
            )}

            <button className="btn danger" onClick={logout}>
              🔓 Logout
            </button>
          </div>
        </div>

        <div className="card recent-complaints">
          <h2>My Complaints</h2>
          <div className="recent-complaints-content">
            {pendingComplaints.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📋</span>
                <p>No complaints yet.</p>
                <p className="empty-hint">Create one from Quick Actions</p>
              </div>
            ) : (
              pendingComplaints.map((item) => (
                <div
                  key={item._id}
                  className={`complaint-item ${item.urgent ? "urgent" : ""}`}
                >
                  <div>
                    <span className="category-badge">{getCategoryLabel(item.category)}</span>
                    <h4>{item.title}</h4>
                    <p>
                      {item.hostel}, Room {item.room_no}
                    </p>
                    <p>Status: Pending</p>
                  </div>
                  {item.urgent && <span className="urgent-badge">Urgent</span>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
