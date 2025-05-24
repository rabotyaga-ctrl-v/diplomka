import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './plot-result-main.css'; // файл стилей, который я тебе написал

export default function PlotResultMain() {
    const navigate = useNavigate();
    const location = useLocation();
    const images = location.state?.images || [];

    const downloadImageMain = (base64, index) => {
        const link = document.createElement('a');
        link.href = `data:image/webp;base64,${base64}`;
        link.download = `plot_main_image_${index + 1}.webp`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (images.length === 0) {
        return (
            <div className="plot-result-container">
                <h1 className="plot-result-title">Результат генерации</h1>
                <p>Нет сгенерированных изображений. Пожалуйста, вернитесь и создайте сюжет.</p>
                <button onClick={() => navigate('/plot')} className="plot-result-navigation-button">
                    Назад к сюжету
                </button>
            </div>
        );
    }

    return (
        <div className="plot-result-container">
            <h1 className="plot-result-title">Результат генерации (Главная версия)</h1>
            <div className="plot-result-images">
                {images.map((img, idx) => (
                    <div key={idx} className="plot-result-image-wrapper">
                        <img
                            src={`data:image/webp;base64,${img}`}
                            alt={`plot main result ${idx + 1}`}
                        />
                        <button
                            onClick={() => downloadImageMain(img, idx)}
                            className="plot-result-download-btn"
                        >
                            Скачать
                        </button>
                    </div>
                ))}
            </div>
            <div className="plot-result-navigation">
                <button onClick={() => navigate('/plot')} className="plot-result-navigation-button">
                    Создать новый сюжет
                </button>
                <button onClick={() => navigate('/')} className="plot-result-navigation-button">
                    На главную
                </button>
            </div>
        </div>
    );
}
