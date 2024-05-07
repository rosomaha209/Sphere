// UserNavBarProfile.js
import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';

function UserNavBarProfile({ maxHeight = 25 }) {
    const [userData, setUserData] = useState(null);
    const defaultProfilePic = 'http://localhost:8000/media/images/no_foto.jpg';
    let name =''
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/users/current/');
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    if (!userData) {
        return <p></p>;
    }
    if (userData.first_name == null)
        name = ''
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                maxHeight: `${maxHeight}px`,
                overflow: 'hidden',
                marginRight: '20px'
            }}
        >
            <img
                src={userData.profile_pic ? userData.profile_pic : defaultProfilePic}
                alt="User Avatar"
                style={{
                    width: `${maxHeight}px`,
                    height: `${maxHeight}px`,
                    borderRadius: '50%',
                    marginRight: '5px',

                }}
            />
            <span
                style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                {`${name} `}
            </span>
        </div>
    );
}

export default UserNavBarProfile;
