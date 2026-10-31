import { FlameIcon, TimerIcon, TrendingUpIcon, UtensilsIcon } from "lucide-react"
import CaloriesChart from "../assets/CaloriesChart"
import { getMotivationalMessage, goalLabels } from "../assets/assets"
import Card from "../components/ui/Card"
import ProgressBar from "../components/ui/ProgressBar"
import { useAppContext } from "../context/AppContext"
import { getLocalDate } from "../utils/date"

const Dashboard = () => {
  const { user, allFoodLogs, allActivityLogs } = useAppContext();

  const today = getLocalDate();
  const calorieLimit = user?.dailyCalorieIntake ?? 2000;
  const burnGoal = user?.dailyCalorieBurn ?? 400;

  const consumed = allFoodLogs.filter((log) => log.date === today).reduce((sum, log) => sum + log.calories, 0);
  const todayActivity = allActivityLogs.filter((log) => log.date === today);
  const burned = todayActivity.reduce((sum, log) => sum + log.calories, 0);
  const activeMinutes = todayActivity.reduce((sum, log) => sum + log.duration, 0);
  const remaining = calorieLimit - consumed;

  const message = getMotivationalMessage(consumed, activeMinutes, calorieLimit);

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <p className="text-emerald-100 text-sm">Welcome back, {user?.username}</p>
        <h1 className="text-2xl font-semibold mt-1">{message.emoji} {message.text}</h1>
        {user?.goal && <p className="text-emerald-100 text-sm mt-2">Goal: {goalLabels[user.goal]}</p>}
      </div>

      <div className="dashboard-grid">
        <Card>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
            <UtensilsIcon className="size-4 text-emerald-500" />
            Calories eaten
          </div>
          <p className="text-2xl font-semibold text-slate-800 dark:text-white mt-2">
            {consumed} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">/ {calorieLimit} kcal</span>
          </p>
          <ProgressBar value={consumed} max={calorieLimit} className="mt-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {remaining >= 0 ? `${remaining} kcal remaining` : `${-remaining} kcal over limit`}
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
            <FlameIcon className="size-4 text-orange-500" />
            Calories burned
          </div>
          <p className="text-2xl font-semibold text-slate-800 dark:text-white mt-2">
            {burned} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">/ {burnGoal} kcal</span>
          </p>
          <ProgressBar value={Math.min(burned, burnGoal)} max={burnGoal} className="mt-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {burned >= burnGoal ? "Daily burn goal reached" : `${burnGoal - burned} kcal to go`}
          </p>
        </Card>

        <div className="dashboard-card-grid">
          <Card>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
              <TimerIcon className="size-4 text-blue-500" />
              Active minutes
            </div>
            <p className="text-2xl font-semibold text-slate-800 dark:text-white mt-2">{activeMinutes}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
              <TrendingUpIcon className="size-4 text-purple-500" />
              Net calories
            </div>
            <p className="text-2xl font-semibold text-slate-800 dark:text-white mt-2">{consumed - burned}</p>
          </Card>
        </div>

        <Card className="lg:col-span-2">
          <h2 className="font-semibold text-slate-800 dark:text-white">Last 7 days</h2>
          <CaloriesChart />
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
