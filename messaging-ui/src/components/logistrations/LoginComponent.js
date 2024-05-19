import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from './AuthContext';

import FaceIDAuth from './FaceIDAuth';

function LoginComponent() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();
    const { setIsLoggedIn } = useAuth();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Очищення попереднього повідомлення про помилки
        try {
            const response = await axios.post('http://localhost:8000/token/', credentials);
            const { access, refresh } = response.data;

            localStorage.setItem('access', access);
            localStorage.setItem('refresh', refresh);
            localStorage.setItem('isLoggedIn', 'true');

            const decoded = jwtDecode(access);
            if (decoded.user_id) {
                localStorage.setItem('userId', decoded.user_id.toString());

                setIsLoggedIn(true);
                history.push('/home');
            } else {
                setErrorMessage('UserId not found in the token.');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage('Invalid email or password. Please try again.');
            } else {
                setErrorMessage('Server error. Please try again later.');
            }
        }
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h5 className="card-title">Face Authentication</h5>
                            <FaceIDAuth />
                            <h5 className="card-title">Login</h5>

                            {errorMessage && (
                                <div className="alert alert-danger" role="alert">
                                    {errorMessage}
                                </div>
                            )}
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