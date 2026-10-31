import { Navigate, Route, Routes } from "react-router-dom"
import Layout from "./pages/Layout"
import FoodLog from "./pages/FoodLog"
import ActivityLog from "./pages/ActivityLog"
import Profile from "./pages/Profile"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Onboarding from "./pages/Onboarding"
import { useAppContext } from "./context/AppContext"

const App = () => {
  const { user, isUserFetched, onboardingCompleted } = useAppContext();

  if (!isUserFetched) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-slate-950">
        <div className="size-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) return <Login/>
  if (!onboardingCompleted) return <Onboarding/>

  return (
    <>
      <Routes>

       <Route path="/" element={<Layout/>}>
        <Route index element={<Dashboard/>}/>
        <Route path="food" element={<FoodLog/>}/>
        <Route path="activity" element={<ActivityLog/>}/>
        <Route path="profile" element={<Profile/>}/>
       </Route>
       <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </>
  )
}

export default App
