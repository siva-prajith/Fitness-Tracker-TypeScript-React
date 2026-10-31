import { useState } from "react"
import { CakeIcon, FlameIcon, LogOutIcon, MoonIcon, RulerIcon, SunIcon, TargetIcon, UtensilsIcon, WeightIcon } from "lucide-react"
import { goalLabels, goalOptions } from "../assets/assets"
import mockApi from "../assets/mockApi"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import Input from "../components/ui/Input"
import Select from "../components/ui/Select"
import { useAppContext } from "../context/AppContext"
import { useTheme } from "../context/ThemeContext"
import type { UserData } from "../types"

const Profile = () => {
  const { user, setUser, logout, allFoodLogs, allActivityLogs } = useAppContext();
  const { theme, toggleTheme } = useTheme();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [age, setAge] = useState<string | number>(user?.age ?? "");
  const [weight, setWeight] = useState<string | number>(user?.weight ?? "");
  const [height, setHeight] = useState<string | number>(user?.height ?? "");
  const [goal, setGoal] = useState<string | number>(user?.goal ?? "maintain");
  const [intake, setIntake] = useState<string | number>(user?.dailyCalorieIntake ?? "");
  const [burn, setBurn] = useState<string | number>(user?.dailyCalorieBurn ?? "");

  const isValid = [age, weight, height, intake, burn].every((value) => Number(value) > 0);

  const handleCancel = () => {
    setAge(user?.age ?? "");
    setWeight(user?.weight ?? "");
    setHeight(user?.height ?? "");
    setGoal(user?.goal ?? "maintain");
    setIntake(user?.dailyCalorieIntake ?? "");
    setBurn(user?.dailyCalorieBurn ?? "");
    setEditing(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isValid) return;
    setSaving(true);
    const updates = { age: Number(age), weight: Number(weight), height: Number(height), goal: goal as UserData["goal"], dailyCalorieIntake: Number(intake), dailyCalorieBurn: Number(burn) };
    await mockApi.user.update(user.id, updates);
    setUser({ ...user, ...updates });
    setSaving(false);
    setEditing(false);
  }

  const infoRows = [
    { label: "Age", value: user?.age, icon: CakeIcon },
    { label: "Weight", value: `${user?.weight} kg`, icon: WeightIcon },
    { label: "Height", value: `${user?.height} cm`, icon: RulerIcon },
    { label: "Goal", value: user?.goal && goalLabels[user.goal], icon: TargetIcon },
    { label: "Daily intake", value: `${user?.dailyCalorieIntake} kcal`, icon: UtensilsIcon },
    { label: "Daily burn", value: `${user?.dailyCalorieBurn} kcal`, icon: FlameIcon },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">{user?.username}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{user?.email}</p>
      </div>

      <div className="profile-content">
        <Card className="self-start">
          <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Your details</h2>
          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <Input label="Age" type="number" min={13} max={120} value={age} onChange={setAge} required />
              <Input label="Weight (kg)" type="number" min={20} max={300} value={weight} onChange={setWeight} required />
              <Input label="Height (cm)" type="number" min={100} max={250} value={height} onChange={setHeight} required />
              <Select label="Goal" value={goal} onChange={setGoal} options={goalOptions} required />
              <Input label="Daily calorie intake" type="number" min={1} value={intake} onChange={setIntake} required />
              <Input label="Daily calorie burn" type="number" min={1} value={burn} onChange={setBurn} required />
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={handleCancel}>Cancel</Button>
                <Button type="submit" className="flex-1" disabled={!isValid || saving}>Save</Button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              {infoRows.map(({ label, value, icon: Icon }) => (
                <div key={label} className="profile-info-row">
                  <Icon className="size-4 text-emerald-500 shrink-0" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
                  <span className="ml-auto text-sm font-medium text-slate-800 dark:text-white">{value}</span>
                </div>
              ))}
              <Button variant="secondary" className="w-full mt-2" onClick={() => setEditing(true)}>Edit details</Button>
            </div>
          )}
        </Card>

        <div className="space-y-4">
          <Card>
            <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Your stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-semibold text-slate-800 dark:text-white">{allFoodLogs.length}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Foods logged</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-800 dark:text-white">{allActivityLogs.length}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Activities logged</p>
              </div>
            </div>
          </Card>

          <Card className="space-y-2">
            <Button variant="secondary" className="w-full" onClick={toggleTheme}>
              {theme === "dark" ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </Button>
            <Button variant="danger" className="w-full" onClick={logout}>
              <LogOutIcon className="size-4" />
              Log out
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile
