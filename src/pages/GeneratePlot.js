import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './generate-plot.css';

const plotTemplates = [
    {
        id: 'template1',
        label: 'Классическое приключение',
        tooltip: 'Герой сталкивается с вызовом, проходит через испытания и возвращается изменённым.',
        text: 'Герой отправляется в опасное путешествие, встречает врагов и друзей, находит силу в себе и возвращается победителем.'
    },
    {
        id: 'template2',
        label: 'История бренда',
        tooltip: 'История продукта или компании, создающая эмоциональную связь с аудиторией.',
        text: 'Небольшая компания начинает с идеи, преодолевает сложности и становится лидером на рынке, благодаря своему уникальному продукту.'
    },
    {
        id: 'template3',
        label: 'Фэнтезийная сказка',
        tooltip: 'Магический мир, герой, зло и победа света.',
        text: 'В волшебном королевстве юный маг отправляется на поиски древнего артефакта, чтобы спасти мир от тьмы.'
    },
];

export default function GeneratePlot() {
    const navigate = useNavigate();

    const [plotText, setPlotText] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [expandedPrompt, setExpandedPrompt] = useState('');
    const [loadingExpand, setLoadingExpand] = useState(false);
    const [loadingGenerate, setLoadingGenerate] = useState(false);
    const [error, setError] = useState('');

    const handleTemplateClick = (id, text) => {
        setSelectedTemplate(id);
        setPlotText(text);
        setExpandedPrompt('');
        setError('');
    };

    const handleExpand = async () => {
        if (!plotText.trim()) {
            alert('Пожалуйста, опишите сюжет вашей истории');
            return;
        }
        setLoadingExpand(true);
        setError('');
        setExpandedPrompt('');
        try {
            const response = await fetch('/plot/expand', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: plotText }),
            });
            const data = await response.json();
            if (response.ok) {
                setExpandedPrompt(data.expanded_prompt || '');
            } else {
                setError(data.error || 'Ошибка при расширении сюжета');
            }
        } catch {
            setError('Ошибка сети при расширении сюжета');
        } finally {
            setLoadingExpand(false);
        }
    };

    const handleGenerate = async () => {
        if (!expandedPrompt.trim()) {
            alert('Промпт пустой');
            return;
        }
        setLoadingGenerate(true);
        setError('');
        try {
            const response = await fetch('/plot/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: expandedPrompt }),
            });
            const data = await response.json();
            if (response.ok) {
                navigate('/plot-result', { state: { images: data.images } });
            } else {
                setError(data.error || 'Ошибка при генерации');
            }
        } catch {
            setError('Ошибка сети при генерации');
        } finally {
            setLoadingGenerate(false);
        }
    };

    return (
        <div className="plot-container">
            <h1 className="plot-title">Создание сюжета</h1>

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
                value={plotText}
                onChange={(e) => {
                    setPlotText(e.target.value);
                    setSelectedTemplate(null);
                    setExpandedPrompt('');
                    setError('');
                }}
                disabled={loadingExpand || loadingGenerate}
            />

            <div className="input-group">
                <label className="input-label">Выберите шаблон сюжета:</label>
                <div className="plot-templates-container">
                    {plotTemplates.map(({ id, label, tooltip, text }) => (
                        <div
                            key={id}
                            className={`plot-template-box ${selectedTemplate === id ? 'selected' : ''}`}
                            title={tooltip}
                            onClick={() => handleTemplateClick(id, text)}
                        >
                            <div>{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {!expandedPrompt && (
                <button
                    onClick={handleExpand}
                    disabled={loadingExpand || loadingGenerate}
                    className="plot-btn"
                    style={{ marginTop: 10 }}
                >
                    {loadingExpand ? 'Обрабатываем сюжет...' : 'Улучшить сюжет'}
                </button>
            )}

            {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}

            {expandedPrompt && (
                <>
                    <h3>Расширенный сюжет (можно редактировать):</h3>
                    <textarea
                        className="plot-textarea"
                        value={expandedPrompt}
                        onChange={(e) => setExpandedPrompt(e.target.value)}
                        disabled={loadingGenerate}
                        rows={6}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={loadingGenerate}
                        className="plot-btn"
                        style={{ marginTop: 10 }}
                    >
                        {loadingGenerate ? 'Генерируем изображения...' : 'Начать магию'}
                    </button>
                </>
            )}

            <div className="plot-navigation-buttons" style={{ marginTop: 20 }}>
                <button
                    onClick={() => navigate('/')}
                    className="plot-btn"
                    disabled={loadingExpand || loadingGenerate}
                >
                    Назад
                </button>
            </div>
        </div>
    );
}
