import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { Loader2, Eye, EyeOff, User, Lock } from 'lucide-react';
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
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('username', username)
                .single();

            if (error || !data) {
                throw new Error('Invalid username or password');
            }

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
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                .login-root {
                    display: flex;
                    min-height: 100vh;
                    font-family: 'Inter', sans-serif;
                }

                /* ── Left Panel ── */
                .login-left {
                    flex: 0 0 60%;
                    position: relative;
                    background-image: url(${edpBg});
                    background-size: cover;
                    background-position: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .login-left-content {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    padding: 2rem;
                    gap: 1.25rem;
                }

                .login-logo-ring {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    border: 3px solid #f1f5f9;
                    overflow: hidden;
                    box-shadow: 0 4px 14px rgba(0,0,0,0.08);
                    background: #fff;
                    margin: 0 auto 1.5rem auto;
                }

                .login-logo-ring img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .login-brand-name {
                    color: #ffffff;
                    font-size: 1.6rem;
                    font-weight: 800;
                    letter-spacing: 0.02em;
                    line-height: 1.2;
                    text-shadow: 0 2px 8px rgba(0,0,0,0.3);
                }

                .login-brand-tagline {
                    color: rgba(255,255,255,0.85);
                    font-size: 0.875rem;
                    font-weight: 400;
                    letter-spacing: 0.01em;
                }

                /* ── Right Panel ── */
                .login-right {
                    flex: 0 0 40%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #ffffff;
                    padding: 2rem;
                }

                .login-form-card {
                    width: 100%;
                    max-width: 400px;
                }

                .login-form-title {
                    font-size: 1.875rem;
                    font-weight: 800;
                    color: #1a237e;
                    margin-bottom: 0.35rem;
                    text-align: center;
                }

                .login-form-subtitle {
                    font-size: 0.875rem;
                    color: #1a237e;
                    margin-bottom: 2rem;
                    text-align: center;
                }

                .login-field-group {
                    margin-bottom: 1.25rem;
                }

                .login-label {
                    display: block;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #1a237e;
                    margin-bottom: 0.45rem;
                    letter-spacing: 0.02em;
                }

                .login-input-wrap {
                    display: flex;
                    align-items: center;
                    border: 1.5px solid #cbd5e1;
                    border-radius: 8px;
                    background: #fff;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    overflow: hidden;
                }

                .login-input-wrap:focus-within {
                    border-color: #1a237e;
                    box-shadow: 0 0 0 3px rgba(26,35,126,0.12);
                }

                .login-input-icon {
                    display: flex;
                    align-items: center;
                    padding: 0 0.75rem;
                    color: #1a237e;
                    flex-shrink: 0;
                }

                .login-input {
                    flex: 1;
                    border: none;
                    outline: none;
                    font-size: 0.9rem;
                    font-family: inherit;
                    color: #1a237e;
                    padding: 0.65rem 0.5rem 0.65rem 0;
                    background: transparent;
                }

                .login-input::placeholder {
                    color: rgba(26,35,126,0.5);
                }

                .login-eye-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    padding: 0 0.75rem;
                    color: #1a237e;
                    transition: color 0.2s;
                }

                .login-eye-btn:hover {
                    color: #121858;
                }

                .login-error {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    color: #dc2626;
                    font-size: 0.8rem;
                    padding: 0.65rem 0.9rem;
                    border-radius: 8px;
                    margin-bottom: 1.25rem;
                }

                .login-submit-btn {
                    width: 100%;
                    padding: 0.75rem;
                    background: #1a237e;
                    color: #ffffff;
                    font-size: 0.95rem;
                    font-weight: 600;
                    font-family: inherit;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
                    margin-top: 1.5rem;
                    box-shadow: 0 4px 14px rgba(26,35,126,0.25);
                }

                .login-submit-btn:hover:not(:disabled) {
                    background: #121858;
                    box-shadow: 0 6px 18px rgba(26,35,126,0.35);
                    transform: translateY(-1px);
                }

                .login-submit-btn:active:not(:disabled) {
                    transform: translateY(0);
                }

                .login-submit-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                @media (max-width: 768px) {
                    .login-root {
                        flex-direction: column;
                    }
                    .login-left {
                        flex: 0 0 220px;
                    }
                }
            `}</style>

            <div className="login-root">
                {/* ── Left Panel ── */}
                <div className="login-left">
                </div>

                {/* ── Right Panel ── */}
                <div className="login-right">
                    <div className="login-form-card">
                        <div className="login-logo-ring">
                            <img src="/logo.jpg" alt="EDP Logo" />
                        </div>
                        <h1 className="login-form-title">EDP Engineering Services</h1>
                        <p className="login-form-subtitle">Excellence · Dedication · Planning</p>

                        {error && (
                            <div className="login-error">{error}</div>
                        )}

                        <form onSubmit={handleLogin}>
                            {/* Username */}
                            <div className="login-field-group">
                                <label className="login-label">Username</label>
                                <div className="login-input-wrap">
                                    <span className="login-input-icon">
                                        <User size={16} />
                                    </span>
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="login-input"
                                        placeholder="Enter your username"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="login-field-group">
                                <label className="login-label">Password</label>
                                <div className="login-input-wrap">
                                    <span className="login-input-icon">
                                        <Lock size={16} />
                                    </span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="login-input"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        className="login-eye-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex="-1"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="login-submit-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Logging in...
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
