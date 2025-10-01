import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle login form changes for CareTaker login
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle login submission for CareTaker
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginData.username || !loginData.password) {
      setError("Username and password are required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${localStorage.getItem("token") || ""}` // Include token if available
        },
        body: JSON.stringify(loginData),
      })

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userId", data.user.id);
      console.log("User data:", data.user);

      // Redirect based on role
      if (data.user.role === "user") {
        navigate("/dashboards");
      } else if (data.user.role === "admin") {
        navigate("/dashboardc");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center w-screen h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/image/1.jpg')" }}
    >
      <div className="bg-black/80 backdrop-blur-md p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-white">Hostel Connect</h2>
        <p className="text-sm text-gray-300 text-center mb-4">
          Platform for Student and Hostel Connect
        </p>

        {/* Role Selection */}
        <Tabs defaultValue="student" className="w-full mb-4">
          <TabsList className="flex bg-gray-700/50 p-1 rounded-md w-full">
            <TabsTrigger
              value="student"
              className="w-1/2 py-2 text-lg font-medium transition 
                         data-[state=active]:bg-white/90 data-[state=active]:shadow 
                         data-[state=active]:text-black data-[state=inactive]:text-gray-300"
            >
              Student
            </TabsTrigger>
            <TabsTrigger
              value="caretaker"
              className="w-1/2 py-2 text-lg font-medium transition 
                         data-[state=active]:bg-white/90 data-[state=active]:shadow 
                         data-[state=active]:text-black data-[state=inactive]:text-gray-300"
            >
              CareTaker
            </TabsTrigger>
          </TabsList>

          {error && (
            <div className="mb-4 p-2 bg-red-500/20 text-red-300 text-sm rounded-md">
              {error}
            </div>
          )}

          {/* Student Tab - Google Auth */}
          <TabsContent value="student">
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 border-gray-500 bg-gray-800 text-white hover:bg-gray-700"
                onClick={() =>
                  window.location.href = "http://localhost:5000/auth/google"
                }
              >
                <FcGoogle className="text-lg" /> Sign in with Google
              </Button>
            </div>
          </TabsContent>

          {/* CareTaker Tab - Local Auth */}
          <TabsContent value="caretaker">
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="text-sm font-medium text-white text-left block">Username</label>
                <Input
                  type="text"
                  name="username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  placeholder="Enter your username"
                  className="border-gray-500 bg-gray-800 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white text-left block">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="Enter your password"
                    className="border-gray-500 bg-gray-800 text-white placeholder-gray-400 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-gray-400 text-center mt-4">
          For students of National Institute of Technology Calicut
        </p>
      </div>
    </div>
  );
}
