import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Services from "./pages/Services";
import Process from "./pages/Process";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import Upload from "./pages/Upload";
import GenerateLayout from "./pages/GenerateLayout";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/services" element={<Services />} />
        <Route path="/process" element={<Process />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/generate-layout" element={<GenerateLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
