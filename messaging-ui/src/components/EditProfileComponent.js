import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditProfileComponent() {
    const [userData, setUserData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        city: '',
        about_me: '',
        gender: '',
        profile_pic: null,
    });

    useEffect(() => {
        (async () => {  // Immediately invoked async function inside useEffect
            try {
                const { data } = await axios.get('http://localhost:8000/api-edit-profile/', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
                });
                // Reset the profile_pic in the state to avoid controlled input issues
                setUserData({ ...data, profile_pic: null });
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        })();
    }, []);

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        setUserData(prev => ({
            ...prev,
            [name]: name === 'profile_pic' ? files[0] : value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        Object.keys(userData).forEach(key => {
            formData.append(key, userData[key]);
        });

        try {
            await axios.patch('http://localhost:8000/api-edit-profile/', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                }
            });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile.');
        }
         console.log([...formData]);
    };

    return (
        <div>
            <h2>Edit Your Profile</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" value={userData.email || ''} onChange={handleChange} placeholder="Email" disabled />
                <input type="text" name="first_name" value={userData.first_name || ''} onChange={handleChange} placeholder="First Name" />
                <input type="text" name="last_name" value={userData.last_name || ''} onChange={handleChange} placeholder="Last Name" />
                <input type="text" name="phone_number" value={userData.phone_number || ''} onChange={handleChange} placeholder="Phone Number" />
                <input type="text" name="city" value={userData.city || ''} onChange={handleChange} placeholder="City" />
                <textarea name="about_me" value={userData.about_me || ''} onChange={handleChange} placeholder="About Me"></textarea>
                <select name="gender" value={userData.gender || ''} onChange={handleChange}>
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                </select>
                <input type="file" name="profile_pic" onChange={handleChange} />
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
}

export default EditProfileComponent;
