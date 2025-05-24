import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Plot.css';  // отдельный CSS файл для Plot

const plotMainTemplates = [
    {
        id: 'main-template1',
        label: 'Классическое приключение',
        tooltip: 'Герой сталкивается с вызовом, проходит через испытания и возвращается изменённым.',
        text: 'Герой отправляется в опасное путешествие, встречает врагов и друзей, находит силу в себе и возвращается победителем.'
    },
    {
        id: 'main-template2',
        label: 'История бренда',
        tooltip: 'История продукта или компании, создающая эмоциональную связь с аудиторией.',
        text: 'Небольшая компания начинает с идеи, преодолевает сложности и становится лидером на рынке, благодаря своему уникальному продукту.'
    },
    {
        id: 'main-template3',
        label: 'Фэнтезийная сказка',
        tooltip: 'Магический мир, герой, зло и победа света.',
        text: 'В волшебном королевстве юный маг отправляется на поиски древнего артефакта, чтобы спасти мир от тьмы.'
    },
];

export default function Plot() {
    const navigate = useNavigate();

    const [plotMainText, setPlotMainText] = useState('');
    const [selectedMainTemplate, setSelectedMainTemplate] = useState(null);
    const [expandedMainPrompt, setExpandedMainPrompt] = useState('');
    const [loadingExpandMain, setLoadingExpandMain] = useState(false);
    const [loadingGenerateMain, setLoadingGenerateMain] = useState(false);
    const [errorMain, setErrorMain] = useState('');

    const handleMainTemplateClick = (id, text) => {
        setSelectedMainTemplate(id);
        setPlotMainText(text);
        setExpandedMainPrompt('');
        setErrorMain('');
    };

    const handleExpandMain = async () => {
        if (!plotMainText.trim()) {
            alert('Пожалуйста, опишите сюжет вашей истории');
            return;
        }
        setLoadingExpandMain(true);
        setErrorMain('');
        setExpandedMainPrompt('');
        try {
            const response = await fetch('/plot-main/expand', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: plotMainText }),
            });
            const data = await response.json();
            if (response.ok) {
                setExpandedMainPrompt(data.expanded_prompt || '');
            } else {
                setErrorMain(data.error || 'Ошибка при расширении сюжета');
            }
        } catch {
            setErrorMain('Ошибка сети при расширении сюжета');
        } finally {
            setLoadingExpandMain(false);
        }
    };

    const handleGenerateMain = async () => {
        if (!expandedMainPrompt.trim()) {
            alert('Промпт пустой');
            return;
        }
        setLoadingGenerateMain(true);
        setErrorMain('');
        try {
            const response = await fetch('/plot-main/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: expandedMainPrompt }),
            });
            const data = await response.json();
            if (response.ok) {
                navigate('/plot-result-main', { state: { images: data.images } });
            } else {
                setErrorMain(data.error || 'Ошибка при генерации');
            }
        } catch {
            setErrorMain('Ошибка сети при генерации');
        } finally {
            setLoadingGenerateMain(false);
        }
    };

    return (
        <div className="plot-container">
            <h1 className="plot-title">Создание сюжета (Главная версия)</h1>

            <pre className="plot-result">
                Кто главный герой?{'\n'}
                Как начинается история?{'\n'}
                Какие события происходят?{'\n'}
                Чем всё заканчивается?{'\n'}
                Если вы пишете для бренда – опишите продукт и его пользу.{'\n'}
                Пример:{'\n'}
                «Молодой бариста открывает кофейню в мегаполисе. Сначала к нему никто не приходит. Потом он создает уникальный сорт кофе, и к нему выстраивается очередь. Финал – вторая кофейня и закат на фоне.»
            </pre>

            <textarea
                className="plot-textarea"
                placeholder="Опишите сюжет вашей истории..."
                value={plotMainText}
                onChange={(e) => {
                    setPlotMainText(e.target.value);
                    setSelectedMainTemplate(null);
                    setExpandedMainPrompt('');
                    setErrorMain('');
                }}
                disabled={loadingExpandMain || loadingGenerateMain}
            />

            <div className="input-group">
                <label className="input-label">Выберите шаблон сюжета:</label>
                <div className="plot-templates-container">
                    {plotMainTemplates.map(({ id, label, tooltip, text }) => (
                        <div
                            key={id}
                            className={`plot-template-box ${selectedMainTemplate === id ? 'selected' : ''}`}
                            title={tooltip}
                            onClick={() => handleMainTemplateClick(id, text)}
                        >
                            <div>{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {!expandedMainPrompt && (
                <button
                    onClick={handleExpandMain}
                    disabled={loadingExpandMain || loadingGenerateMain}
                    className="plot-btn"
                    style={{ marginTop: 10 }}
                >
                    {loadingExpandMain ? 'Обрабатываем сюжет...' : 'Улучшить сюжет'}
                </button>
            )}

            {errorMain && <p style={{ color: 'red', marginTop: 10 }}>{errorMain}</p>}

            {expandedMainPrompt && (
                <>
                    <h3>Расширенный сюжет (можно редактировать):</h3>
                    <textarea
                        className="plot-textarea"
                        value={expandedMainPrompt}
                        onChange={(e) => setExpandedMainPrompt(e.target.value)}
                        disabled={loadingGenerateMain}
                        rows={6}
                    />
                    <button
                        onClick={handleGenerateMain}
                        disabled={loadingGenerateMain}
                        className="plot-btn"
                        style={{ marginTop: 10 }}
                    >
                        {loadingGenerateMain ? 'Генерируем изображения...' : 'Начать магию'}
                    </button>
                </>
            )}

            <div className="plot-navigation-buttons" style={{ marginTop: 20 }}>
                <button
                    onClick={() => navigate('/character')}
                    className="plot-btn"
                    disabled={loadingExpandMain || loadingGenerateMain}
                >
                    Назад
                </button>
            </div>
        </div>
    );
}
