import { createContext, useContext, useEffect, useState } from "react";
import { initialState, type ActivityEntry, type Credentials, type FoodEntry, type User } from "../types";
import { useNavigate } from "react-router-dom";
import mockApi from "../assets/mockApi";


const AppContext = createContext(initialState);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(null);
  const [isUserFetched, setIsUserFetched] = useState(!localStorage.getItem("token"));
  const [onboardingCompleted,setOnboardingCompleted]=useState(false);
  const [allFoodLogs,setAllFoodLogs]=useState<FoodEntry[]>([]);
  const[allActivityLogs,setAllActivityLogs]=useState<ActivityEntry[]>([]);

  const fetchLogs= async()=>{
    const [food, activity] = await Promise.all([mockApi.foodLogs.list(), mockApi.activityLogs.list()]);
    setAllFoodLogs(food.data);
    setAllActivityLogs(activity.data);
  }

  const signup= async(credentials:Credentials)=>{
    const { data } = await mockApi.auth.register(credentials);
    setUser({ ...data.user, token: data.jwt });
    setOnboardingCompleted(Boolean(data.user.age));
    localStorage.setItem("token", data.jwt);
    await fetchLogs();
    navigate("/");
  }

  const login= async(credentials:Credentials)=>{
    const { data } = await mockApi.auth.login(credentials);
    setUser({ ...data.user, token: data.jwt });
    setOnboardingCompleted(Boolean(data.user.age));
    localStorage.setItem("token", data.jwt);
    await fetchLogs();
    navigate("/");
  }

  const fetchUser= async(token:string)=>{
    const { data } = await mockApi.user.me();
    setUser({ ...data, token });
    setOnboardingCompleted(Boolean(data.age));
    await fetchLogs();
    setIsUserFetched(true);
  }

  const logout= ()=>{
    localStorage.removeItem("token");
    setUser(null);
    setOnboardingCompleted(false);
    setAllFoodLogs([]);
    setAllActivityLogs([]);
    navigate("/");
  }

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if (token) fetchUser(token);
  },[]);

  const value = {
    user,
    setUser,
    login,
    signup,
    fetchUser,
    isUserFetched,
    logout,
    onboardingCompleted,
    setOnboardingCompleted,
    allFoodLogs,
    setAllFoodLogs,
    allActivityLogs,
    setAllActivityLogs,
  }
  return <AppContext.Provider value={value}>
    {children}
  </AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext);
