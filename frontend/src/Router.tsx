import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./ProtectedRoute";
import Upload from "./pages/Upload";
import VideoPlayer from "./pages/VideoPlayer";
import UserVideos from "./pages/UserVideos";
import SignIn from './pages/Signin';
import SignUp from './pages/Signup';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path:'/signin',
    element :<SignIn/>
  },
  {
    path:'/signup',
    element :<SignUp/>
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/upload",
        element: <Upload />,
      },
      {
        path: "/videoplayer",
        element: <VideoPlayer/>,
      },
      {
        path: "/uservideos",
        element: <UserVideos />,
      },
    ],
  },
]);

export default router;
