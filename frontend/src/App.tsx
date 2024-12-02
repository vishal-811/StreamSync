import { BrowserRouter, Routes, Route } from "react-router-dom";
import Upload from "./pages/Upload";
import LandingPage from './pages/LandingPage'
import './App.css';
import StreamSyncSignup from "./pages/Signup";
import StreamSyncSignIn from "./pages/Signin";
function App() {
  return (
    <div className="w-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/signup" element={<StreamSyncSignup/>}/>
          <Route path="/signin" element ={<StreamSyncSignIn/>}/>
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
