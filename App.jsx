import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import EmployeeDashboard from './employee-dashboard';
import Login from './Login';
import { Loader2 } from 'lucide-react';

const App = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for local session
        const storedUser = localStorage.getItem('edp_user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const handleLogin = (user) => {
        setCurrentUser(user);
        localStorage.setItem('edp_user', JSON.stringify(user));
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('edp_user');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div>
            {!currentUser ? (
                <Login onLogin={handleLogin} />
            ) : (
                <EmployeeDashboard
                    user={currentUser}
                    onLogout={handleLogout}
                />
            )}
        </div>
    );
};

export default App;
