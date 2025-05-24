import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Character.css';

export default function PlotResult() {
    const navigate = useNavigate();
    const location = useLocation();
    const images = location.state?.images || [];

    // Функция для скачивания всех изображений по очереди (zip или по отдельности)
    // Чтобы просто скачать по отдельности — сделаем по кнопке для каждого изображения.
    // Для массового скачивания нужен zip и библиотека, упрощаем пока.
    const downloadImage = (base64, index) => {
        const link = document.createElement('a');
        link.href = `data:image/webp;base64,${base64}`;
        link.download = `plot_image_${index + 1}.webp`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (images.length === 0) {
        return (
            <div className="character-container">
                <h1 className="character-title">Результат генерации</h1>
                <p>Нет сгенерированных изображений. Пожалуйста, вернитесь и создайте сюжет.</p>
                <button onClick={() => navigate('/generate-plot')} className="character-btn">
                    Назад к сюжету
                </button>
            </div>
        );
    }

    return (
        <div className="character-container">
            <h1 className="character-title">Результат генерации</h1>
            <div className="plot-result-images" style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                {images.map((img, idx) => (
                    <div key={idx} style={{ textAlign: 'center' }}>
                        <img
                            src={`data:image/webp;base64,${img}`}
                            alt={`plot result ${idx + 1}`}
                            style={{ width: 200, borderRadius: 8, boxShadow: '0 0 8px rgba(0,0,0,0.2)' }}
                        />
                        <button
                            onClick={() => downloadImage(img, idx)}
                            className="character-btn"
                            style={{ marginTop: 8, fontSize: 14 }}
                        >
                            Скачать
                        </button>
                    </div>
                ))}
            </div>
            <div className="navigation-buttons" style={{ marginTop: 30 }}>
                <button onClick={() => navigate('/generate-plot')} className="character-btn">
                    Создать новый сюжет
                </button>
                <button onClick={() => navigate('/')} className="character-btn" style={{ marginLeft: 10 }}>
                    На главную
                </button>
            </div>
        </div>
    );
}
