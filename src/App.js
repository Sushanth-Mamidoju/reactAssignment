import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import CardsPage from "./components/cards";
import History from "./components/history";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CardsPage />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
