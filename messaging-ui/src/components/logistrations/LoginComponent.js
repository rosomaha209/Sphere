import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from './AuthContext';

function LoginComponent() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const history = useHistory();
    const { setIsLoggedIn } = useAuth(); // Доступ до setIsLoggedIn через useAuth

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/token/', credentials);
            const { access, refresh } = response.data;

            localStorage.setItem('access', access);
            localStorage.setItem('refresh', refresh);
            localStorage.setItem('isLoggedIn', 'true');

            const decoded = jwtDecode(access);
            if (decoded.user_id) {
                localStorage.setItem('userId', decoded.user_id.toString());
                setIsLoggedIn(true); // Оновлення стану входу

                history.push('/home');
            } else {
                console.error('UserId not found in token');
            }
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : 'No response from server');
        }
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h5 className="card-title">Login</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={credentials.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Log in</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginComponent;
