import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'; // Імпортуємо useHistory замість useNavigate
import axios from '../api/axiosConfig';
import '../styles/UserProfile.css';

function UserProfileComponent() {
    const [userData, setUserData] = useState(null);
    const history = useHistory();  // Ініціалізуємо useHistory
    const defaultProfilePic = 'http://localhost:8000/media/images/no_foto.jpg';

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/users/current/");
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                history.push('/login');  // Використовуємо push для перенаправлення
            }
        };

        fetchUserData();
    }, [history]);  // Додаємо history у список залежностей

    if (!userData) {
        return <p>Loading user data...</p>;
    }

    return (
        <div>
            <h1>User Profile</h1>
            <div>
                <p>Email: {userData.email}</p>
                <p>Name: {userData.first_name} {userData.last_name}</p>
                <p>Date of Birth: {userData.date_of_birth}</p>
                <p>Phone Number: {userData.phone_number}</p>
                <p>City: {userData.city}</p>
                <p>About Me: {userData.about_me}</p>
                <div>
                    <img
                        src={userData.profile_pic ? userData.profile_pic : defaultProfilePic}
                        alt="Profile"
                        className="profile-pic"
                    />
                </div>
            </div>
        </div>
    );
}

export default UserProfileComponent;
