import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Landing page components
import Header from "./components/Header";
import SearchBar from "./components/Landing-Page/SearchBar";
import About from "./components/Landing-Page/about";
import How from "./components/Landing-Page/how";
import Faq from "./components/Landing-Page/faq";
import PharmacyListing from "./components/Landing-Page/pharmaListing";
import Footer from "./components/Landing-Page/footer";

// Dashboard page
// import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/" element={
            <>
              <Header />
              <SearchBar isDashboard={false} />
              <About />
              <How />
              <PharmacyListing />
              <Faq />
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
