import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import EditProfileComponent from '../src/components/EditProfileComponent';
import mockAxios from 'jest-mock-axios';
import '@testing-library/jest-dom';

afterEach(() => {
    mockAxios.reset();
});

describe('EditProfileComponent', () => {
    it('loads and displays initial profile data', async () => {
        const profileData = {
            email: 'user@example.com',
            first_name: 'John',
            last_name: 'Doe',
            phone_number: '1234567890',
            city: 'Cityname',
            about_me: 'About me text',
            gender: 'M',
            is_staff: true
        };

        // Мокати запит при ініціалізації компоненту
        mockAxios.get.mockResolvedValueOnce({ data: profileData });

        render(<EditProfileComponent />);

        await waitFor(() => {
            expect(screen.getByPlaceholderText('Email')).toHaveValue(profileData.email);
            expect(screen.getByPlaceholderText('First Name')).toHaveValue(profileData.first_name);
            expect(screen.getByPlaceholderText('Last Name')).toHaveValue(profileData.last_name);
        });

        // Перевірка, чи компонент PermissionsManager відображається для суперкористувача
        expect(screen.getByText('Update Profile')).toBeInTheDocument();
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(mockAxios.get).toHaveBeenCalledWith('http://localhost:8000/api-edit-profile/', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });
    });

    it('handles form submission correctly', async () => {
        const profileData = {
            email: 'user@example.com',
            first_name: 'John',
            last_name: 'Doe',
            phone_number: '1234567890',
            city: 'Cityname',
            about_me: 'About me text',
            gender: 'M',
            is_staff: true
        };

        mockAxios.get.mockResolvedValueOnce({ data: profileData });
        render(<EditProfileComponent />);

        await waitFor(() => {
            fireEvent.change(screen.getByPlaceholderText('About Me'), {
                target: { name: 'about_me', value: 'Updated about me text' }
            });
        });

        fireEvent.click(screen.getByText('Update Profile'));

        await waitFor(() => {
            expect(mockAxios.patch).toHaveBeenCalledTimes(1);
        });

        expect(mockAxios.patch).toHaveBeenCalledWith(
            'http://localhost:8000/api-edit-profile/',
            expect.any(FormData), // Перевіряємо, що передається об'єкт FormData
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
    });
});
