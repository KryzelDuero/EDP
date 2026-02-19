import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import edpBg from './assets/EDP.JPG';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);



    const hashPassword = async (string) => {
        const utf8 = new TextEncoder().encode(string);
        const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Fetch user by username first
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('username', username)
                .single();

            if (error || !data) {
                throw new Error('Invalid username or password');
            }

            // Verify password (check both hash and plain text)
            const hashedPassword = await hashPassword(password);
            const isMatch = data.passwordhash === hashedPassword || data.passwordhash === password;

            if (isMatch) {
                onLogin(data);
            } else {
                throw new Error('Invalid username or password');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url(${edpBg})` }}>
            <div className="absolute inset-0 bg-slate-900/40"></div>
            <div className="max-w-md w-full bg-white/95 backdrop-blur shadow-2xl rounded-2xl p-8 relative z-10 border border-white/20">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-white">
                            <img src="/logo.jpg" alt="EDP Logo" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#1a237e] uppercase tracking-wide">EDP ENGINEERING SERVICES</h1>
                    <p className="text-[#d32f2f] font-bold text-lg mt-2 tracking-wider">Excellence - Dedication - Planning</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all pr-10"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                tabIndex="-1"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
