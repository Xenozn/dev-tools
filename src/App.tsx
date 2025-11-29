// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import TokenGenerator from './pages/TokenGenerator';
import ColorsConverter from "./pages/ColorsConverter.tsx";
import QrGenerator from "./pages/QrGenerator.tsx";

import { ConfigProvider, theme } from "antd";

function App() {
    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm, // <-- Dark theme global
            }}
        >
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/token" element={<TokenGenerator />} />
                        <Route path="/colors" element={<ColorsConverter />} />
                        <Route path="/qrcode" element={<QrGenerator />} />
                    </Routes>
                </Layout>
            </Router>
        </ConfigProvider>
    );
}

export default App;
