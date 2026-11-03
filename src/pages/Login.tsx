import { AtSignIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { useEffect, useState, type SubmitEvent } from "react"
import type { AuthMode } from "../types";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Login = () => {
  const [state, setState] = useState<AuthMode>('login');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();

  const { login, signup, user } = useAppContext();

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (state === 'login') {
        await login({ email, password })
      } else {
        await signup({ username, email, password })
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  return (
    <main className="login-page-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-medium text-gray-900 dark:text-white">
          {state === 'login' ? "Sign In" : "Sign Up"}
        </h2>
        <p className="mt-2 text-sm text-gray-500/90 dark:text-gray-400">{state === 'login' ? 'Please enter email and password to access.' : "Please enter your details to create an account."}</p>

        {state !== 'login' && (
          <div className="mt-4">
            <label htmlFor="username" className="font-medium text-sm text-gray-700 dark:text-gray-300">Username</label>
            <div className="relative mt-2">
              <AtSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5" />
              <input id="username" onChange={(e) => setUsername(e.target.value)}
                value={username}
                type="text" placeholder="Enter a username" className="login-input" autoComplete="username" required />
            </div>
          </div>
        )}

        <div className="mt-4">
          <label htmlFor="email" className="font-medium text-sm text-gray-700 dark:text-gray-300">Email</label>
          <div className="relative mt-2">
            <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5" />
            <input id="email" onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email" placeholder="Please enter your email" className="login-input" autoComplete="email" required />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="password" className="font-medium text-sm text-gray-700 dark:text-gray-300">Password</label>
          <div className="relative mt-2">
            <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5" />
            <input id="password" onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Please enter your password" className="login-input pr-10" required
              type={showPassword ? 'text' : "password"}
              autoComplete={state === 'login' ? 'current-password' : 'new-password'} />

            <button type="button" onClick={() => setShowPassword((p) => !p)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="login-button">
          {isSubmitting
            ? (state === 'login' ? "Signing in..." : "Signing up...")
            : (state === "login" ? 'Login' : 'Sign up')}
        </button>

        {state === 'login' ? (
          <p className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?
            <button type="button" className="ml-1 cursor-pointer text-green-600 hover:underline" onClick={() => setState('sign up')}>
              Sign up
            </button>
          </p>
        ) : (
          <p className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
            Already have an account?
            <button type="button" className="ml-1 cursor-pointer text-green-600 hover:underline" onClick={() => setState('login')}>
              Login
            </button>
          </p>
        )}
      </form>
    </main>
  )
}

export default Login
