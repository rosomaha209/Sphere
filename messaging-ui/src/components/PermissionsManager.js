import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
        <div>
            {error && <div className="alert alert-danger">{error}</div>}
            {permissions.map(perm => (
                <div key={perm.id}>
                    <div>{perm.target_user.first_name} {perm.target_user.last_name} ({perm.target_user.email})</div>
                    <label>
                        Може коментувати:
                        <input
                            type="checkbox"
                            checked={perm.can_comment}
                            onChange={(e) => handlePermissionChange(perm.id, e.target.checked)}
                        />
                    </label>
                </div>
            ))}
        </div>
    );
}

export default PermissionsManager;
