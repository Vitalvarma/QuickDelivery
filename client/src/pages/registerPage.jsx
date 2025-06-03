import { useState } from "react";
import useAuthStore from "../stores/authStore";
import toast from "react-hot-toast";

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("customer");
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [loading, setLoading] = useState(false);

    const { register } = useAuthStore();


    const handleRegister = (e) => {

        e.preventDefault();
        setLoading(true);
        // Handle registration logic here
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        if (!termsAccepted) {
            alert("Please accept the terms and conditions!");
            return;
        }
        // Simulate registration success
        register(username, email, password, role)
            .then((response) => {
                setUsername("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setRole("customer");
                setTermsAccepted(false);
                if (response.success) {
                    // Redirect to login or dashboard
                    toast.success(response.message);
                    setTimeout(()=>{
                        window.location.href = "/";
                    },1000);
                } else {
                    setLoading(false);
                    toast.error(response?.error || response?.message);
                }
            })
            .catch((error) => {
                setLoading(false);
                console.error("Registration error:", error);
                alert("An error occurred during registration. Please try again.");
            });
        
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-red-50 flex items-center justify-center p-4">
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
                onSubmit={handleRegister}
            >
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-green-500 to-red-500 p-6">
                    <h2 className="text-2xl font-bold text-white text-center">Create Your Account</h2>
                </div>

                {/* Form content */}
                <div className="p-6 space-y-4">
                    {/* Username field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input 
                            type="text" 
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                            placeholder="Choose a username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            minLength={3}
                        />
                    </div>

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
                            minLength={6}
                        />
                    </div>

                    {/* Confirm Password field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input 
                            type="password" 
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    {/* Role selection */}
                    <div className="space-y-2 pt-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Register As
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
                                />
                                <span className="ml-2 text-sm text-gray-700">Driver</span>
                            </label>
                        </div>
                    </div>

                    {/* Terms and conditions */}
                    <div className="flex items-start pt-2">
                        <div className="flex items-center h-5">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                required
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="font-medium text-gray-700">
                                I agree to the{' '}
                                <a href="#" className="text-green-600 hover:text-green-500">
                                    Terms and Conditions
                                </a>
                            </label>
                        </div>
                    </div>

                    {/* Submit button */}
                    <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-green-500 to-red-500 text-white py-3 px-4 rounded-md hover:from-green-600 hover:to-red-600 transition duration-200 shadow-md font-medium mt-4"
                        disabled={!termsAccepted}
                    >
                        Create Account
                    </button>

                    {/* Footer link */}
                    <div className="text-center text-sm text-gray-600 pt-4">
                        Already have an account?{" "}
                        <a 
                            href="/login" 
                            className="font-medium text-green-600 hover:text-green-800 transition duration-200"
                        >
                            Sign in here
                        </a>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;