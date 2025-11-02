import './App.css';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar'; // --- NEW IMPORT ---

function App() {
  return (
    <div className="app-layout">
      {/* --- RENDER THE SIDEBAR --- */}
      <Sidebar />

      {/* --- This is where all our pages will render --- */}
      <main className="app-content-area">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
