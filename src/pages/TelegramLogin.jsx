import { useEffect, useState } from 'react';

export default function TelegramLogin() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('tg_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        window.onTelegramAuth = (userData) => {
            localStorage.setItem('tg_user', JSON.stringify(userData));
            setUser(userData);
        };

        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.async = true;
        script.setAttribute('data-telegram-login', 'zavod_worker_bot'); // имя бота
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-userpic', 'false');
        script.setAttribute('data-request-access', 'write');
        script.setAttribute('data-onauth', 'onTelegramAuth(user)');
        document.getElementById('telegram-button')?.appendChild(script);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('tg_user');
        setUser(null);
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: 'linear-gradient(to right, #fbc2eb, #a6c1ee)',
                fontFamily: 'Manrope, sans-serif',
                textAlign: 'center',
                padding: '20px'
            }}
        >
            {user ? (
                <>
                    <h2>Добро пожаловать, @{user.username}!</h2>
                    <p>Вы успешно вошли через Telegram.</p>
                    <button
                        onClick={handleLogout}
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '8px',
                            backgroundColor: '#ff5e7e',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Выйти
                    </button>
                </>
            ) : (
                <>
                    <h1>Войти в аккаунт</h1>
                    <p>Авторизуйтесь через Telegram, чтобы сохранить ваши истории и изображения.</p>
                    <div id="telegram-button" style={{ marginTop: '20px' }}></div>
                </>
            )}
        </div>
    );
}
