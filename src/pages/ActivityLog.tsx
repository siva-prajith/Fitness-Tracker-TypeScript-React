import { useState } from "react"
import { Trash2Icon } from "lucide-react"
import { quickActivities } from "../assets/assets"
import mockApi from "../assets/mockApi"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import Input from "../components/ui/Input"
import { useAppContext } from "../context/AppContext"
import type { ActivityEntry } from "../types"
import { getLocalDate } from "../utils/date"

const ActivityLog = () => {
  const { allActivityLogs, setAllActivityLogs } = useAppContext();
  const [name, setName] = useState("");
  const [duration, setDuration] = useState<string | number>(30);
  const [calories, setCalories] = useState<string | number>("");
  // kcal per minute of the picked quick activity; null once calories are typed by hand
  const [rate, setRate] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const today = getLocalDate();
  const todayLogs = allActivityLogs.filter((log) => log.date === today);
  const totalMinutes = todayLogs.reduce((sum, log) => sum + log.duration, 0);
  const totalCalories = todayLogs.reduce((sum, log) => sum + log.calories, 0);
  const isValid = name.trim() !== "" && Number(duration) > 0 && Number(calories) > 0;

  const handleQuickPick = (activity: typeof quickActivities[number]) => {
    setName(activity.name);
    setRate(activity.rate);
    setCalories(activity.rate * Number(duration));
  }

  const handleDurationChange = (value: string | number) => {
    setDuration(value);
    if (rate !== null) setCalories(rate * Number(value));
  }

  const handleCaloriesChange = (value: string | number) => {
    setCalories(value);
    setRate(null);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setSaving(true);
    const { data } = await mockApi.activityLogs.create({ data: { name: name.trim(), duration: Number(duration), calories: Number(calories) } });
    setAllActivityLogs((logs) => [...logs, data]);
    setName("");
    setDuration(30);
    setCalories("");
    setRate(null);
    setSaving(false);
  }

  const handleDelete = async (log: ActivityEntry) => {
    await mockApi.activityLogs.delete(log.documentId);
    setAllActivityLogs((logs) => logs.filter((item) => item.documentId !== log.documentId));
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">Activity Log</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {totalMinutes} min · {totalCalories} kcal burned today
        </p>
      </div>

      <div className="page-content-grid">
        <Card className="self-start">
          <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Add activity</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {quickActivities.map((activity) => (
              <button
                key={activity.name}
                type="button"
                onClick={() => handleQuickPick(activity)}
                className={`p-2 rounded-xl text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 cursor-pointer transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 ${name === activity.name ? "ring-2 ring-emerald-500" : ""}`}
              >
                {activity.emoji} {activity.name}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Activity name" value={name} onChange={(value) => setName(String(value))} placeholder="e.g. Morning run" required />
            <Input label="Duration (minutes)" type="number" min={1} value={duration} onChange={handleDurationChange} required />
            <Input label="Calories burned" type="number" min={1} value={calories} onChange={handleCaloriesChange} placeholder="e.g. 300" required />
            <Button type="submit" className="w-full" disabled={!isValid || saving}>Add activity</Button>
          </form>
        </Card>

        <Card className="self-start">
          <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Today's activities</h2>
          {todayLogs.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">Nothing logged yet today.</p>}
          <div className="space-y-2">
            {todayLogs.map((log) => (
              <div key={log.documentId} className="activity-entry-item">
                <div className="min-w-0">
                  <p className="font-medium text-slate-800 dark:text-white truncate">{log.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{log.duration} min</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{log.calories} kcal</span>
                  <button type="button" aria-label={`Delete ${log.name}`} onClick={() => handleDelete(log)} className="p-1.5 text-slate-400 hover:text-red-500 cursor-pointer transition-colors">
                    <Trash2Icon className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ActivityLog
