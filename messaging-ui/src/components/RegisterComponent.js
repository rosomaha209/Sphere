import React, { useState } from 'react';
import axios from 'axios';  // Переконайтеся, що axios встановлено і правильно налаштовано
import { useHistory } from 'react-router-dom'; // Використовуйте, якщо потрібен редирект

function FastRegisterComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const history = useHistory();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
        try {
            const response = await axios.post('http://localhost:8000/api-registration/', {
                email: email,
                password1: password,
                password2: confirmPassword,
            });
            console.log(response.data);
            alert('Registration successful');
            history.push('/login'); // Перенаправлення на сторінку логіну після успішної реєстрації
        } catch (error) {
            console.error('Registration failed:', error.response?.data || error.message);
            alert('Registration failed');
        }
    };

    return (
        <div>
            <h1>Fast Registration</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default FastRegisterComponent;
