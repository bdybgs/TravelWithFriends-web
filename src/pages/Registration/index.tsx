import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegistrationPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleRegister = async () => {
        try {
            const response = await axios.post('/api/register', formData);
            if (response.status === 200) {
                // Регистрация прошла успешно
                console.log('Регистрация прошла успешно');
                // Перенаправляем пользователя на страницу входа
                navigate('/login');
            }
        } catch (error) {
            // Обработка ошибок регистрации
            console.error('Ошибка при регистрации:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    return (
        <div>
            <h2>Регистрация</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    value={formData.password}
                    onChange={handleChange}
                />
                <button type="submit">Зарегистрироваться</button>
            </form>
        </div>
    );
};

export default RegistrationPage;
