import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function RegisterComponent() {
    const [userData, setUserData] = useState({
        email: '',
        password1: '',
        password2: '',
        first_name: '',
        last_name: '',
        // Додайте інші поля якщо потрібно
    });
    const history = useHistory();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserData({...userData, [name]: value});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (userData.password1 !== userData.password2) {
            alert("Passwords do not match.");
            return;
        }
        try {
            const response = await axios.post('http://localhost:8000/register/', userData);
            console.log(response.data);
            alert('Registration successful');
            history.push('/login');  // Перенаправлення на сторінку логіну після успішної реєстрації
        } catch (error) {
            console.error('Registration failed:', error.response.data);
            alert('Registration failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email" required />
            <input type="password" name="password1" value={userData.password1} onChange={handleChange} placeholder="Password" required />
            <input type="password" name="password2" value={userData.password2} onChange={handleChange} placeholder="Confirm Password" required />
            <input type="text" name="first_name" value={userData.first_name} onChange={handleChange} placeholder="First Name" />
            <input type="text" name="last_name" value={userData.last_name} onChange={handleChange} placeholder="Last Name" />
            {/* Додайте інші поля форми якщо потрібно */}
            <button type="submit">Register</button>
        </form>
    );
}

export default RegisterComponent;
