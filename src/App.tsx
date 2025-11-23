// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import TokenGenerator from './pages/TokenGenerator';
function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/token" element={<TokenGenerator />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
