import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [accessCode, setAccessCode] = useState('');
    const { user } = useContext(AuthContext);

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post(`${import.meta.env.REACT_APP_API_URL}/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setAccessCode(res.data.accessCode);
        } catch (error) {
            alert('File upload failed');
        }
    };

    return (
        <div>
            <h2>Upload File</h2>
            <form onSubmit={handleFileUpload}>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
                <button type="submit">Upload</button>
            </form>
            {accessCode && <p>Access Code: {accessCode}</p>}
        </div>
    );
};

export default UploadFile;
