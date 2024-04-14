// LogoutComponent.js
import React, { useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useAuth } from './AuthContext';

const LogoutComponent = () => {
    const history = useHistory();
    const { setIsLoggedIn } = useAuth(); // Отримайте setIsLoggedIn з контексту

    useEffect(() => {
        const performLogout = async () => {
            const refreshToken = localStorage.getItem('refresh');
            try {
                await axios.post('/logout/', { refresh_token: refreshToken });
                console.log('Logout successful');
                localStorage.setItem('isLoggedIn', 'false');

                setIsLoggedIn(false);
            } catch (error) {
                console.error('Logout failed:', error.response ? error.response.data.error : 'No server response');
            }
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');

            history.push('/login');
        };

        performLogout();
    }, [setIsLoggedIn, history]);

    return <div>Logging out...</div>;
}

export default LogoutComponent;
