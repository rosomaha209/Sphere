import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/PermissionsManager.css';

function PermissionsManager() {
    const [permissions, setPermissions] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('http://localhost:8000/posts/comment-permissions2/');
                setPermissions(response.data);
            } catch (err) {
                setError('Не вдалося завантажити дозволи. Будь ласка, спробуйте пізніше.');
                console.error('Error fetching permissions:', err);
            }
        }
        fetchData();
    }, []);

    const handlePermissionChange = async (permissionId, canComment) => {
        try {
            await axios.patch(`http://localhost:8000/posts/comment-permissions2/${permissionId}/`, {
                can_comment: canComment
            });
            setPermissions(currentPermissions =>
                currentPermissions.map(perm =>
                    perm.id === permissionId ? { ...perm, can_comment: canComment } : perm
                )
            );
        } catch (err) {
            setError('Не вдалося оновити дозвіл. Будь ласка, спробуйте пізніше.');
            console.error('Error updating permission:', err);
        }
    };

    return (
        <div className="container mt-4">
            {error && <div className="alert alert-danger">{error}</div>}
            <ul className="list-group">
                {permissions.map(perm => (
                    <li key={perm.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <span className="user-name">{perm.target_user.first_name} {perm.target_user.last_name}</span>
                            <span className="user-email"> ({perm.target_user.email})</span>
                        </div>
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id={`can-comment-${perm.id}`}
                                checked={perm.can_comment}
                                onChange={(e) => handlePermissionChange(perm.id, e.target.checked)}
                            />
                            <label className="form-check-label comment-label" htmlFor={`can-comment-${perm.id}`}>
                                Може коментувати
                            </label>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PermissionsManager;
