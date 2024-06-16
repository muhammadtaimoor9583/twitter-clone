import { useState } from "react";
import {Routes,Route} from 'react-router-dom'


import SignUpPage from "./pages/auth/signup/SignUpPage";
import LoginPage from "./pages/auth/signup/LoginPage";
import HomePage from "./pages/home/HomePage";
import ProfilePage from "./pages/profile/ProfilePage";
import Sidebar from "./components/common/Sidebar";
import NotificationPage from "./pages/notification/NotificationPage";
import RightPanel from "./components/common/RightPanel";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    
		<div className='flex max-w-6xl mx-auto'>
      <Sidebar/>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/signup' element={<SignUpPage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/profile/:username' element={<ProfilePage />} />
				<Route path='/notifications' element={<NotificationPage />} />

			</Routes>
      <RightPanel/>
		</div>
    </>
  );
}

export default App;
