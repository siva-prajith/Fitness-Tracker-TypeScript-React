import { ActivityIcon, DumbbellIcon, HomeIcon, UserIcon, UtensilsIcon } from "lucide-react"
import { NavLink, Outlet } from "react-router-dom"

const navItems = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/food", label: "Food", icon: UtensilsIcon },
  { to: "/activity", label: "Activity", icon: ActivityIcon },
  { to: "/profile", label: "Profile", icon: UserIcon },
]

const Layout = () => {
  return (
    <div className="layout-container">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 h-screen p-4 border-r border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 px-3 py-4 mb-4 font-bold text-lg text-slate-800 dark:text-white">
          <DumbbellIcon className="size-6 text-emerald-500" />
          FitTrack
        </div>
        <nav className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors duration-200 ${isActive ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"}`}
            >
              <Icon className="size-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 min-w-0 lg:overflow-y-auto">
        <Outlet/>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex justify-around py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) => `flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}
          >
            <Icon className="size-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Layout
