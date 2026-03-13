import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-cream">
            <h1 className="text-2xl font-serif text-brown-dark p-8">Connect Portal</h1>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}
