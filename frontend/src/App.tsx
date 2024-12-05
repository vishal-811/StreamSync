import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Upload from "./pages/Upload";
import LandingPage from './pages/LandingPage'
import StreamSyncSignup from "./pages/Signup";
import StreamSyncSignIn from "./pages/Signin";
import VideoPlayer from "./pages/VideoPlayer";
import UserVideos from './pages/UserVideos';
function App() {
  return (
    <div className="w-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/signup" element={<StreamSyncSignup/>}/>
          <Route path="/signin" element ={<StreamSyncSignIn/>}/>
          <Route path="/upload" element={<Upload />} />
          <Route path="/videoplayer" element={<VideoPlayer/>}/>
          <Route path='uservideos' element={<UserVideos/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
