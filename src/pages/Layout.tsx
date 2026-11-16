import BottomNav from "../components/ui/BottomNav"
import Sidebar from "../components/ui/Sidebar"
import { Outlet } from "react-router-dom"


const Layout = () => {
  return (
    <div className="layout-container">

      <Sidebar />
      <div className="flex-1 overflow-y-scroll">
        <Outlet />
      </div>
       <BottomNav/>
    </div>
  )
}

export default Layout
