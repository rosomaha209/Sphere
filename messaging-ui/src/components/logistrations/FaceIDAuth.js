import React, { useState } from 'react';
import axios from 'axios';

function FaceIDAuth() {
    const [image, setImage] = useState(null);

    const handleImageUpload = (event) => {
        setImage(event.target.files[0]);
    };

    const handleRegister = () => {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('user', JSON.stringify({
            username: 'your-username',
            password: 'your-password'
        }));

        axios.post('/register_face/', formData)
            .then(response => {
                alert('Registered successfully');
            })
            .catch(error => {
                alert('Registration failed');
            });
    };

    const handleLogin = () => {
        const formData = new FormData();
        formData.append('image', image);

        axios.post('/login_face/', formData)
            .then(response => {
                localStorage.setItem('token', response.data.access);
                alert('Logged in successfully');
            })
            .catch(error => {
                alert('Login failed');
            });
    };

    return (
        <div>
            <input type="file" onChange={handleImageUpload} />
            <button onClick={handleRegister}>Register</button>
            <button onClick={handleLogin}>Login with Face ID</button>
        </div>
    );
}

export default FaceIDAuth;
