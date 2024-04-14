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
        (async () => {
            try {
                const { data } = await axios.get('http://localhost:8000/api-edit-profile/', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
                });
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
        if (userData[key] !== undefined && userData[key] !== null) {
            if (key === 'profile_pic') {
                if (userData[key]) formData.append(key, userData[key]);  // Додаємо файл тільки якщо він обраний
            } else {
                formData.append(key, userData[key]);  // Додаємо інші поля, якщо вони існують і не null
            }
        }
    });

    try {
        await axios.patch('http://localhost:8000/api-edit-profile/', formData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'multipart/form-data'  // Важливо для файлів
            }
        });
        alert('Profile updated successfully!');
    } catch (error) {
        console.error('Failed to update profile:', error);
        alert('Failed to update profile.');
    }
};

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Edit Your Profile</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" className="form-control" name="email" value={userData.email || ''} onChange={handleChange} placeholder="Email" disabled />
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control" name="first_name" value={userData.first_name || ''} onChange={handleChange} placeholder="First Name" />
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control" name="last_name" value={userData.last_name || ''} onChange={handleChange} placeholder="Last Name" />
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control" name="phone_number" value={userData.phone_number || ''} onChange={handleChange} placeholder="Phone Number" />
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control" name="city" value={userData.city || ''} onChange={handleChange} placeholder="City" />
                                </div>
                                <div className="mb-3">
                                    <textarea className="form-control" name="about_me" value={userData.about_me || ''} onChange={handleChange} placeholder="About Me"></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="gender" className="form-label">Gender</label>
                                    <select className="form-select" name="gender" value={userData.gender || ''} onChange={handleChange}>
                                        <option value="">Select Gender</option>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                        <option value="O">Other</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="profile_pic" className="form-label">Profile Picture</label>
                                    <input type="file" className="form-control" name="profile_pic" onChange={handleChange} />
                                </div>
                                <button type="submit" className="btn btn-primary">Update Profile</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProfileComponent;
