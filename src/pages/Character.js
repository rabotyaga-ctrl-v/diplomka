import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Character.css';

const stylesList = [
    {
        id: 'cartoon',
        name: 'Мультяшный стиль',
        img: '/images/photo4.jpg',
        tooltip: 'Яркие цвета, упрощённые формы, динамичный мультяшный стиль.',
    },
    {
        id: 'anime',
        name: 'Аниме стиль',
        img: '/images/photo2.jpg',
        tooltip: 'Стиль японской анимации с выразительными глазами и детализированными персонажами.',
    },
    {
        id: 'vangogh',
        name: 'Стиль Ван Гога',
        img: '/images/photo3.jpg',
        tooltip: 'Импрессионизм, мазки кисти и живописные текстуры как у Ван Гога.',
    },
];

export default function Character() {
    const navigate = useNavigate();

    const [inputText, setInputText] = useState('');
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [generatedImage, setGeneratedImage] = useState(null);
    const [generated, setGenerated] = useState(false);

    const promptHelp = `
Как написать хороший промпт для изображения персонажа:
- Опишите внешний вид: возраст, пол, одежду, позу.
- Добавьте черты характера: улыбчивый, мрачный, решительный.
- Укажите фон или окружение, если важно.
- Можно добавить стилистические детали: яркие цвета, тёмный фон, фэнтези.
- Чем подробнее, тем лучше!
Например: "Молодой рыцарь в блестящих доспехах, с решительным взглядом, на фоне старинного замка при закате, в стиле мультфильма."
`;

    const handleStyleSelect = (id) => setSelectedStyle(id);

    const handleGenerate = async () => {
        if (!inputText.trim()) return alert('Пожалуйста, опишите вашего персонажа.');
        if (!selectedStyle) return alert('Выберите стиль изображения.');

        setLoading(true);
        setResult('');
        setGeneratedImage(null);
        setGenerated(false);

        try {
            const response = await fetch("/generate-character/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: inputText.trim(),
                    style: selectedStyle
                }),
            });
            const data = await response.json();

            if (response.ok) {
                setResult(data.prompt_with_style || '');
                if (data.image_base64) {
                    setGeneratedImage(data.image_base64);
                }
                setGenerated(true);
            } else {
                alert(data.error || "Ошибка при генерации");
            }
        } catch (error) {
            alert("Ошибка при генерации. Попробуйте позже.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="character-container">
            <h1 className="character-title">Создание персонажа</h1>

            <pre className="generated-result">
                {promptHelp.trim()}
            </pre>

            <textarea
                className="character-textarea"
                placeholder="Опишите вашего персонажа..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={loading}
            />

            <div className="input-group">
                <label className="input-label">Выберите стиль:</label>
                <div className="templates-container">
                    {stylesList.map(({ id, name, img, tooltip }) => (
                        <div
                            key={id}
                            className={`template-box ${selectedStyle === id ? 'selected' : ''}`}
                            title={tooltip}
                            onClick={() => handleStyleSelect(id)}
                        >
                            <img src={img} alt={name} />
                            <div>{name}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="navigation-buttons">
                <button onClick={() => navigate('/')} disabled={loading} className="character-btn">
                    Назад
                </button>
                <button onClick={handleGenerate} disabled={loading} className="character-btn">
                    {loading ? 'Генерация...' : 'Отправить'}
                </button>
            </div>

            {generated && generatedImage && (
                <div className="generated-result">
                    <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Результат:</h2>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{result}</p>
                    <img
                        src={`data:image/webp;base64,${generatedImage}`}
                        alt="Generated character"
                        style={{ maxWidth: '100%', marginTop: 20, borderRadius: 8 }}
                    />
                    <button onClick={() => navigate('/plot')} className="character-btn" style={{ marginTop: 20 }}>
                        Далее
                    </button>
                </div>
            )}
        </div>
    );
}
