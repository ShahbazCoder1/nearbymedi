import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import SearchBar from "./components/Landing-Page/SearchBar";
import About from "./components/Landing-Page/about";
import How from "./components/Landing-Page/how";
import Faq from "./components/Landing-Page/faq";
import PharmacyListing from "./components/Landing-Page/pharmaListing";
import Footer from "./components/Landing-Page/footer";
import Dashboard from "./pages/Dashboard/Dashboard";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search/:query?" element={<Dashboard />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
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
