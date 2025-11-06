import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
// import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import './index.css'; // path to your CSS fil

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="results/:id" element={<ResultsPage />} />
        {/* <Route path="dashboard" element={<DashboardPage />} /> */}
        <Route path="about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}

export default App;
