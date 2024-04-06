import React, { useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const LogoutComponent = () => {
    const history = useHistory();

    useEffect(() => {
        const performLogout = async () => {
            const refreshToken = localStorage.getItem('refresh');
            try {
                await axios.post('/logout/', { refresh_token: refreshToken });
                console.log('Logout successful');
            } catch (error) {
                console.error('Logout failed:', error.response.data.error);
            }
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            history.push('/login');
        };

        performLogout();
    }, [history]);

    return <div>Logging out...</div>;
}

export default LogoutComponent;
