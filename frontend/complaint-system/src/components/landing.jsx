import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:3000";
const HOSTELS = ["A-Block", "B-Block", "C-Block", "D-Block", "Girls Hostel"];

function Landing() {
  const navigate = useNavigate();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [role, setRole] = useState("student");
  const [hostel, setHostel] = useState(HOSTELS[0]);

  useEffect(() => {
    setHostel(HOSTELS[0]);
  }, [role]);

  async function signUp() {
    const username = usernameRef.current?.value?.trim();
    const password = passwordRef.current?.value?.trim();
    if (!username || !password) {
      alert("Username and password required");
      return;
    }
    if (!hostel) {
      alert("Please select your hostel");
      return;
    }

    const url = role === "warden" ? `${API}/signup/warden` : `${API}/signup/student`;
    const body = { username, password, hostel };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", role);
      navigate(`/dashboard/${role}`);
    } else {
      alert(data.message || "Sign up failed");
      usernameRef.current.value = "";
      passwordRef.current.value = "";
    }
  }

  async function login() {
    const username = usernameRef.current?.value?.trim();
    const password = passwordRef.current?.value?.trim();
    if (!username || !password) {
      alert("Username and password required");
      return;
    }

    const url = role === "warden" ? `${API}/signin/warden` : `${API}/signin/student`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", role);
      navigate(`/dashboard/${role}`);
    } else {
      alert(data.message || "Login failed");
      usernameRef.current.value = "";
      passwordRef.current.value = "";
    }
  }

  return (
    <div className="landing-page">
      <div className="container">
        <div className="landing-header">
          <h1>🏠 Hostel Complaint System</h1>
          <p>Students lodge • Wardens manage</p>
        </div>

        <div className="navbar">
          <button
            className={`tab ${role === "student" ? "active" : ""}`}
            onClick={() => setRole("student")}
          >
            Student
          </button>
          <button
            className={`tab ${role === "warden" ? "active" : ""}`}
            onClick={() => setRole("warden")}
          >
            Warden
          </button>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label>Select your hostel</label>
            <select
              value={hostel}
              onChange={(e) => setHostel(e.target.value)}
              className="input"
            >
              {HOSTELS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              ref={usernameRef}
              id="username"
              type="text"
              placeholder="Enter username"
              className="input"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              ref={passwordRef}
              id="password"
              type="password"
              placeholder="Enter password"
              className="input"
            />
          </div>

          <button className="btn primary" onClick={login}>
            Login
          </button>
          <p className="form-hint">Don&apos;t have an account?</p>
          <button className="btn secondary" onClick={signUp}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;
