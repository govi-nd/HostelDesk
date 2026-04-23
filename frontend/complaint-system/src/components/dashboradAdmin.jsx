import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:3000";
const CATEGORIES = [
  { value: "electrical", label: "Elec", color: "#93c5fd" },
  { value: "plumbing", label: "Plumb", color: "#fcd34d" },
  { value: "water", label: "Net", color: "#86efac" },
  { value: "maintenance", label: "Mess", color: "#fca5a5" },
  { value: "cleanliness", label: "Clean", color: "#e5e7eb" },
  { value: "other", label: "Sec", color: "#fde68a" },
];

function DashBoardAdmin() {
  const [wardenName, setWardenName] = useState("");
  const [hostel, setHostel] = useState("");
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

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
        if (userRes.data.role !== "warden") {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }
        setWardenName(userRes.data.username);
        setHostel(userRes.data.hostel || "");

        const compRes = await axios.get(`${API}/warden/complaints`, {
          headers: { authorization: token },
        });
        setComplaints(compRes.data.complaints || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [navigate]);

  const stats = {
    total: complaints.length,
    open: complaints.filter((c) => c.status === "open").length,
    progress: complaints.filter((c) => c.status === "assigned" || c.status === "submitted").length,
    resolved: complaints.filter((c) => c.status === "resolved" || c.done).length,
    urgent: complaints.filter((c) => c.urgent).length,
    byCat: Object.fromEntries(CATEGORIES.map((c) => [c.value, complaints.filter((x) => x.category === c.value).length])),
  };
  const urgentComplaints = complaints.filter((c) => c.urgent).slice(0, 2);

  return (
    <div className="admin-v2-page">
      <div className="admin-v2-shell">
        <aside className="admin-v2-sidebar">
          <div className="admin-v2-brand">
            <h3>HostelDesk</h3>
            <p>Admin panel</p>
          </div>
          <nav className="admin-v2-nav">
            <button className="admin-v2-nav-item active">Overview</button>
            <button className="admin-v2-nav-item">All complaints</button>
            <button className="admin-v2-nav-item">Assign staff</button>
            <button className="admin-v2-nav-item">Students</button>
            <button className="admin-v2-nav-item">Reports</button>
            <button
              className="admin-v2-nav-item danger"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/");
              }}
            >
              Logout
            </button>
          </nav>
        </aside>

        <main className="admin-v2-main">
          <div className="admin-v2-head">
            <h1>Overview</h1>
            <p>All hostel complaints at a glance</p>
          </div>

          <div className="admin-v2-stats">
            <div className="admin-v2-stat-card">
              <span>Total</span>
              <strong>{stats.total}</strong>
            </div>
            <div className="admin-v2-stat-card">
              <span>Open</span>
              <strong className="open">{stats.open}</strong>
            </div>
            <div className="admin-v2-stat-card">
              <span>In progress</span>
              <strong className="progress">{stats.progress}</strong>
            </div>
            <div className="admin-v2-stat-card">
              <span>Resolved</span>
              <strong className="resolved">{stats.resolved}</strong>
            </div>
          </div>

          <div className="admin-v2-grid">
            <section className="admin-v2-panel">
              <h2>By category</h2>
              <div className="admin-v2-category-row">
                {CATEGORIES.map((cat) => (
                  <div key={cat.value} className="admin-v2-category-item">
                    <span style={{ background: cat.color }} />
                    <small>{cat.label}</small>
                  </div>
                ))}
              </div>
              <div className="admin-v2-category-counts">
                {CATEGORIES.map((cat) => (
                  <small key={cat.value}>{stats.byCat[cat.value]}</small>
                ))}
              </div>
            </section>

            <section className="admin-v2-panel">
              <h2>Urgent complaints</h2>
              {urgentComplaints.length === 0 ? (
                <div className="admin-v2-urgent-card">
                  <p>No urgent complaints</p>
                </div>
              ) : (
                urgentComplaints.map((item) => (
                  <div key={item._id} className="admin-v2-urgent-card">
                    <div className="admin-v2-urgent-top">
                      <strong>{item.title}</strong>
                      <span>Urgent</span>
                    </div>
                    <p>
                      {item.hostel || hostel} • {item.category} •{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashBoardAdmin;
