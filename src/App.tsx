import "./App.css";
import 'leaflet/dist/leaflet.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Homes";
import Header from "./components/Header";
import AboutMe from "./pages/aboutMe";
import MiniApps from "./pages/MiniApps";
import Footer from "./components/Footer";
import DestinationMap from "./pages/DestinationMap";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <BrowserRouter>
        <Header />
        <main className="flex-grow-1 w-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/AboutMe" element={<AboutMe />} />
            <Route path="/DestinationMap" element={<DestinationMap />} />
            <Route path="/MiniApps" element={<MiniApps />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;