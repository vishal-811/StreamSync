import './App.css';
import { RouterProvider } from 'react-router-dom';
import router from './Router'
import AppInitializer from './lib/AppInitializer/AppInitializer';

function App() {
  return (
    <div className="w-screen">
      <AppInitializer/>
     <RouterProvider router={router}/>
    </div>
  );
}

export default App;
