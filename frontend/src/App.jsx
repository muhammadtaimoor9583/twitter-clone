import { useState } from "react";
import {Routes,Route, Navigate} from 'react-router-dom'


import SignUpPage from "./pages/auth/signup/SignUpPage";
import LoginPage from "./pages/auth/signup/LoginPage";
import HomePage from "./pages/home/HomePage";
import ProfilePage from "./pages/profile/ProfilePage";
import Sidebar from "./components/common/Sidebar";
import NotificationPage from "./pages/notification/NotificationPage";
import RightPanel from "./components/common/RightPanel";
import toast, {Toaster} from 'react-hot-toast'
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";


function App() {
  const [count, setCount] = useState(0);
  const {data:authUser,isLoading,isError,error,isSuccess}=useQuery({
	queryKey:['authUser'],
	queryFn:async()=>{
		try {
			const res=await fetch('http://localhost:5000/api/auth/me',{
				method:"GET",
				credentials:'include'
			});
		const data=await res.json();
		if(data.error) return null;
		if(!res.ok){
			throw new Error(data.error || 'Something went wrong');
		}
		console.log(data);
		return data;
		} catch (error) {
			console.log('something went wrong');
			throw new Error(error);
			
		}
	},
	retry:false
  });
  if(isLoading){
	return <div className="flex items-center justify-center min-h-screen">{<LoadingSpinner/>}</div>
  }

  return (
    <>
    
		<div className='flex max-w-6xl mx-auto'>
      {authUser && <Sidebar/>}
			<Routes>
				<Route path='/' element={authUser? <HomePage/> : <Navigate to= '/login'/>}/>
				<Route path='/signup' element={!authUser? <SignUpPage/> : <Navigate to= '/'/>}/>
				<Route path='/login' element={!authUser ? <LoginPage /> :<Navigate to= '/'/>}/>
				<Route path='/profile/:username' element={authUser? <ProfilePage />:<Navigate to= '/login'/>}/>
				<Route path='/notifications' element={authUser ? <NotificationPage />: <Navigate to= '/login'/>}/>
			</Routes>
      {authUser && <RightPanel/>}
      <Toaster/>
		</div>
    </>
  );
}

export default App;
