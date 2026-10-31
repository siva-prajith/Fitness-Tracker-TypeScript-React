import { useState } from "react"
import { Trash2Icon } from "lucide-react"
import { mealColors, mealIcons, mealTypeOptions } from "../assets/assets"
import mockApi from "../assets/mockApi"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import Input from "../components/ui/Input"
import Select from "../components/ui/Select"
import { useAppContext } from "../context/AppContext"
import type { FoodEntry } from "../types"
import { getLocalDate } from "../utils/date"

const FoodLog = () => {
  const { user, allFoodLogs, setAllFoodLogs } = useAppContext();
  const [name, setName] = useState("");
  const [calories, setCalories] = useState<string | number>("");
  const [mealType, setMealType] = useState<string | number>("");
  const [saving, setSaving] = useState(false);

  const today = getLocalDate();
  const todayLogs = allFoodLogs.filter((log) => log.date === today);
  const totalCalories = todayLogs.reduce((sum, log) => sum + log.calories, 0);
  const isValid = name.trim() !== "" && Number(calories) > 0 && mealType !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setSaving(true);
    const { data } = await mockApi.foodLogs.create({ data: { name: name.trim(), calories: Number(calories), mealType } });
    setAllFoodLogs((logs) => [...logs, data]);
    setName("");
    setCalories("");
    setMealType("");
    setSaving(false);
  }

  const handleDelete = async (log: FoodEntry) => {
    if (!log.documentId) return;
    await mockApi.foodLogs.delete(log.documentId);
    setAllFoodLogs((logs) => logs.filter((item) => item.documentId !== log.documentId));
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">Food Log</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {totalCalories} / {user?.dailyCalorieIntake ?? 2000} kcal today
        </p>
      </div>

      <div className="page-content-grid">
        <Card className="self-start">
          <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Add food</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Food name" value={name} onChange={(value) => setName(String(value))} placeholder="e.g. Chicken salad" required />
            <Input label="Calories" type="number" min={1} value={calories} onChange={setCalories} placeholder="e.g. 450" required />
            <Select label="Meal" value={mealType} onChange={setMealType} options={mealTypeOptions} placeholder="Select a meal" required />
            <Button type="submit" className="w-full" disabled={!isValid || saving}>Add food</Button>
          </form>
        </Card>

        <Card className="self-start">
          <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Today's meals</h2>
          {todayLogs.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">Nothing logged yet today.</p>}
          <div className="space-y-2">
            {todayLogs.map((log) => {
              const Icon = mealIcons[log.mealType];
              return (
                <div key={log.documentId ?? log.id} className="food-entry-item">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 ${mealColors[log.mealType]}`}>
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 dark:text-white truncate">{log.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{log.mealType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{log.calories} kcal</span>
                    <button type="button" aria-label={`Delete ${log.name}`} onClick={() => handleDelete(log)} className="p-1.5 text-slate-400 hover:text-red-500 cursor-pointer transition-colors">
                      <Trash2Icon className="size-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default FoodLog
