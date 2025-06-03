import { useState } from "react";
import useAuthStore from "../stores/authStore";
import toast from "react-hot-toast";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer");
    const [loading, setLoading] = useState(false);

    const { login } = useAuthStore();

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        login(email, password, role)
            .then((response) => {
                setEmail("");
                setPassword("");
                setRole("customer");
                if (response.success) {
                    toast.success(response.message);
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1000);
                } else {
                    setLoading(false);
                    toast.error(response?.error || response?.message);
                }
            })
            .catch((error) => {
                setLoading(false);
                console.error("Login error:", error);
                alert("An error occurred during login. Please try again.");
            });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-red-50 flex items-center justify-center p-4 relative">
            {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                    <div className="flex space-x-4">
                        <div className="w-8 h-8 rounded-full animate-spin border-4 border-green-500 border-t-red-500"></div>
                        <div className="w-8 h-8 rounded-full animate-spin border-4 border-red-500 border-t-green-500"></div>
                    </div>
                </div>
            )}
            <form
                className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden"
                onSubmit={handleLogin}
            >
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-green-500 to-red-500 p-6">
                    <h2 className="text-2xl font-bold text-white text-center">Welcome Back || Login</h2>
                </div>

                {/* Form content */}
                <div className="p-6 space-y-6">
                    {/* Email field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Password field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Role selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Login As
                        </label>
                        <div className="flex space-x-6 mt-2">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="role"
                                    value="customer"
                                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                                    checked={role === "customer"}
                                    onChange={(e) => setRole(e.target.value)}
                                    disabled={loading}
                                />
                                <span className="ml-2 text-sm text-gray-700">Customer</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="role"
                                    value="driver"
                                    className="h-4 w-4 text-red-600 focus:ring-red-500"
                                    checked={role === "driver"}
                                    onChange={(e) => setRole(e.target.value)}
                                    disabled={loading}
                                />
                                <span className="ml-2 text-sm text-gray-700">Driver</span>
                            </label>
                        </div>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-500 to-red-500 text-white py-3 px-4 rounded-md hover:from-green-600 hover:to-red-600 transition duration-200 shadow-md font-medium"
                        disabled={loading}
                    >
                        Login
                    </button>

                    {/* Footer link */}
                    <div className="text-center text-sm text-gray-600 pt-4">
                        Don't have an account?{" "}
                        <a
                            href="/register"
                            className="font-medium text-green-600 hover:text-green-800 transition duration-200"
                        >
                            Register here
                        </a>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
