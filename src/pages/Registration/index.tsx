import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/RegisterForm.css';

// @ts-ignore
const RegisterForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        try {
            const { data } = await axios.post(
                `http://localhost:5247/v1/Accounts?name=${formData.name}&email=${formData.email}&password=${formData.password}`
            );

            setErrorMessage('');
            console.log('Registration successful:', data);

            onClose();
        } catch (error) {
            // @ts-ignore
            console.error('Registration error:', error.response.data);
            setErrorMessage('Registration failed. Please try again.');
        }
    };

    useEffect(() => {
        document.body.classList.add('overlay');

        return () => {
            document.body.classList.remove('overlay');
        };
    }, []);

    return (
        <div className="register-form">
            <span className="close" onClick={onClose}>&times;</span>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <form onSubmit={handleSubmit} className="form-container">
                <label className="input-label">
                    Name:
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" />
                </label>
                <label className="input-label">
                    Email:
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" />
                </label>
                <label className="input-label">
                    Password:
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field" />
                </label>
                <button type="submit" className="submit-button">Register</button>
            </form>
        </div>
    );


};

export default RegisterForm;
