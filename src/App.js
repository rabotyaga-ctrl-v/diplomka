import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import MyProjects from "./pages/MyProjects";
import Character from "./pages/Character";
import Plot from "./pages/Plot";
import TelegramLogin from './pages/TelegramLogin';

import GenerateCharacter from "./pages/GenerateCharacter";
import GeneratePlot from "./pages/GeneratePlot";
import PlotResult from "./pages/PlotResult";
import PlotResultMain from "./pages/PlotResultMain";  // импорт нового результата

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<TelegramLogin />} />
                <Route path="/character" element={<Character />} />
                <Route path="/plot" element={<Plot />} />

                <Route path="/generate-character" element={<GenerateCharacter />} />
                <Route path="/generate-plot" element={<GeneratePlot />} />
                <Route path="/my-projects" element={<MyProjects />} />
                <Route path="/plot-result" element={<PlotResult />} />
                <Route path="/plot-result-main" element={<PlotResultMain />} />
            </Routes>
        </Router>
    );
};

export default App;
