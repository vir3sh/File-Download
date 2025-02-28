import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import React from "react";
const FileList = () => {
    const [files, setFiles] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchFiles = async () => {
            const res = await axios.get(`${import.meta.env.REACT_APP_API_URL}/files`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setFiles(res.data);
        };
        fetchFiles();
    }, [user]);

    return (
        <div>
            <h2>Uploaded Files</h2>
            <ul>
                {files.map(file => (
                    <li key={file._id}>{file.originalName}</li>
                ))}
            </ul>
        </div>
    );
};

export default FileList;
