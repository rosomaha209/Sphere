import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import '../styles/UserProfile.css';


function UserProfileComponent() {
    const [userData, setUserData] = useState(null);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/users/current/");  // Оновлена URL адреса
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div>
            <h1>User Profile</h1>
            {userData ? (
                console.log(userData.profile_pic),
                <div>
                    <p>Email: {userData.email}</p>
                    <p>Name: {userData.first_name} {userData.last_name}</p>
                    <p>Date of Birth: {userData.date_of_birth}</p>
                    <p>Phone Number: {userData.phone_number}</p>
                    <p>City: {userData.city}</p>
                    <p>About Me: {userData.about_me}</p>
                    {userData.profile_pic && <img src={userData.profile_pic} alt="Profile" className="profile-pic" />}


                </div>
            ) : <p>Loading user data...</p>}
        </div>
    );
}

export default UserProfileComponent;
