import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

const loginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!email | !password){
            setError("Email and Password are required to Log In");
            setLoading(false);
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Invalid email format');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email, password}),
            });

            const data = await response.json();

            if (!response.ok){
                setError("Login failed, please retry")
            }
        }
    }
}