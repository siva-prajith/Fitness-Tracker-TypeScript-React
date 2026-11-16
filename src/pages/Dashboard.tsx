import { useEffect, useState } from "react";
import { getMotivationalMessage } from "../assets/assets";
import { useAppContext } from "../context/AppContext"
import type { ActivityEntry, FoodEntry } from "../types";
import Card from "../components/ui/Card";
import ProgressBar from "../components/ui/ProgressBar";
import { Activity, FlameIcon, Hamburger } from "lucide-react";


const Dashboard = () => {

  const { user, allActivityLogs, allFoodLogs } = useAppContext();
  const [todayFood, setTodayFood] = useState<FoodEntry[]>([]);
  const [todayActivities, setTodayActivities] = useState<ActivityEntry[]>([]);

  const DAILY_CALORIE_LIMIT: number = user?.dailyCalorieIntake || 2000;

  const totalCalories = todayFood.reduce((sum, f) => sum + f.calories, 0);
  const totalActiveMinutes = todayActivities.reduce((sum, a) => sum + a.duration, 0);
  const totalBurned: number = todayActivities.reduce((sum, item) => sum + (item.calories || 0), 0)

  const motivation = getMotivationalMessage(
    totalCalories,
    totalActiveMinutes,
    DAILY_CALORIE_LIMIT
  );


  const loadUserData = () => {
    const today = new Date().toISOString().split('T')[0];
    const foodData = allFoodLogs.filter((f: FoodEntry) => f.createdAt?.split('T')[0] === today)

    setTodayFood(foodData);

    const activityData = allActivityLogs.filter((a: ActivityEntry) => a.createdAt?.split('T')[0] === today)
    setTodayActivities(activityData);
  }

  const remainingCalories: number = DAILY_CALORIE_LIMIT - totalCalories;



  useEffect(() => {
    loadUserData();
  }, [allFoodLogs, allActivityLogs]);

  return (
    <div className="page-container">

      <div className="dashboard-header">
        <p className="text-emerald-100 text-sm font-medium">Welcome back</p>
        <h1 className="text-2xl font-bold mt-1">{`Hi there, ${user?.username ?? ""} 👋`}</h1>

        <div className="mt-6 bg-white/20 backdrop:blur-sm rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{motivation.emoji}</span>
            <p className="text-white font-medium">{motivation.text}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <Card className="shadow-lg col-span-2">
          <div className="flex items-center justify-between mb-4">

            <div className="flex items-center gap-3">

              <div className='w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center'>
                <Hamburger className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Calories Consumed</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{totalCalories}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400">Limit</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{DAILY_CALORIE_LIMIT}</p>

            </div >

          </div>
          <ProgressBar value={totalCalories} max={DAILY_CALORIE_LIMIT} />
          <div className="flex items-center justify-between mt-4">
            <div className={`px-3 py-1.5 rounded-lg ${remainingCalories >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400'}`}>
              <span className="text-sm font-medium">
                {remainingCalories >= 0 ? `${remainingCalories} Kcal remaining` : `${Math.abs(remainingCalories)} Kcal over`}
              </span>
            </div>
            <span className="text-sm text-slate-400">{Math.round((totalCalories / DAILY_CALORIE_LIMIT) * 100)} % </span>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 my-4 "></div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">

              <div className='w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center'>
                <FlameIcon className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Calories Burned</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{totalBurned}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400">Goal</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{user?.dailyCalorieBurn || 400}</p>

            </div >
          </div>

          <ProgressBar value={totalBurned} max={user?.dailyCalorieBurn || 400} />
        </Card>

        {/*Stats Row*/}

        <div className="dashboard-card-grid">
          {/* Active Minutes */}
          <Card>
             <div className="flex items-center gap-3 mb-3">
              <div>
                <Activity className="w-5 h-5 text-blue-500"/>
              </div>
              <p className="text-sm text-slate-500">Active</p>
             </div>
             <p >{totalActiveMinutes}</p>
             <p>minutes today</p>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
