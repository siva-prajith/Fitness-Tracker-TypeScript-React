import { Route, Routes } from "react-router-dom"
import Layout from "./pages/Layout"
import FoodLog from "./pages/FoodLog"
import ActivityLog from "./pages/ActivityLog"
import Profile from "./pages/Profile"
import Dashboard from "./pages/Dashboard"
import { useAppContext } from "./context/AppContext"
import Login from "./pages/Login"
import Loading from "./components/ui/Loading"
import Onboarding from "./pages/Onboarding"
import ThemeToggle from "./components/ui/ThemeToggle"

const App = () => {
  const { user, isUserFetched, onboardingCompleted } = useAppContext();

  if (!user) {
    return (
      <>
        <ThemeToggle />
        {isUserFetched ? <Login /> : <Loading />}
      </>
    )
  }

  if (!onboardingCompleted) {
    return (
      <>
        <ThemeToggle />
        <Onboarding />
      </>
    )
  }
  return (
    <>
      <ThemeToggle />
      <Routes>

        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="food" element={<FoodLog />} />
          <Route path="activity" element={<ActivityLog />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
