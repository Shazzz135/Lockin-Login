import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import cakeSvg from "../assets/cake.svg";

interface DecodedToken {
  firstname?: string;
  lastname?: string;
  count?: number;
  email?: string;
  exp?: number;
  [key: string]: any;
}

function Home() {
  const [user, setUser] = useState<{ firstname?: string; lastname?: string; count?: number; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    try {
      const response = await fetch("/api/refresh-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.accessToken);
        return data.accessToken;
      }
    } catch (err) {}
    return null;
  };

  const getValidAccessToken = async (): Promise<string | null> => {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return null;

    try {
      const decoded: DecodedToken = jwtDecode(accessToken);
      const now = Math.floor(Date.now() / 1000);

      // If token expires in less than 1 minute, refresh it
      if (decoded.exp && decoded.exp - now < 60) {
        accessToken = await refreshAccessToken();
      }
    } catch (err) {
      accessToken = await refreshAccessToken();
    }

    return accessToken;
  };

  useEffect(() => {
    const initializeUser = async () => {
      const accessToken = await getValidAccessToken();
      
      if (accessToken) {
        try {
          const decoded = jwtDecode<DecodedToken>(accessToken);
          setUser({ firstname: decoded.firstname, lastname: decoded.lastname, count: decoded.count, email: decoded.email });
        } catch (err) {
          setUser(null);
          navigate("/auth/login", { replace: true });
        }
      } else {
        setUser(null);
        navigate("/auth/login", { replace: true });
      }
      setLoading(false);
    };

    initializeUser();
  }, [navigate]);

  const handleIncrement = async () => {
    if (!user || !user.email) return;
    
    const newCount = typeof user.count === "number" ? user.count + 1 : 1;

    try {
      // Update database immediately
      const response = await fetch("/api/update-count", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, count: newCount }),
      });

      if (response.ok) {
        // Update local state
        setUser({ ...user, count: newCount });
        
        // Get fresh access token with updated count
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          const decoded = jwtDecode<DecodedToken>(newAccessToken);
          setUser({ ...user, count: decoded.count });
        }
      }
    } catch (err) {
      console.error("Failed to update count:", err);
    }
  };

  const handleLogout = async () => {
    if (!user || !user.email) return;
    
    try {
      // Save final count to database
      await fetch("/api/update-count", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, count: user.count }),
      });
    } catch (err) {}
    
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/auth/login", { replace: true });
  };

  if (loading) {
    return <div className="text-center text-white text-2xl">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl text-white font-bold mb-4">Welcome, {user.firstname} {user.lastname}!</h1>
      {typeof user.count === "number" && (
        <div className="flex flex-col items-center mt-4">
          <div className="flex items-center gap-3 text-2xl text-white font-bold mb-4">
            <img src={cakeSvg} alt="cake" className="w-8 h-8" />
            <span>Count: {user.count}</span>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition cursor-pointer" onClick={handleIncrement}>
            Add One
          </button>
        </div>
      )}
      <div className="flex flex-col items-center mt-4">
        <button className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition hover:cursor-pointer" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Home;
