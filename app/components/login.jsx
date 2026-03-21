'use client'
import { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react'
import { useLoginMutation, useLogoutMutation } from '../features/authSlice';
import Cookies from 'js-cookie';
import Joi from 'joi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function LoginPage() {

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, isError, error}] = useLoginMutation();
  const [logout, {isLoading: logoutLoading}] = useLogoutMutation();
  
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  let onChangeHandler = (e) => {
    const {name, value} = e.target;
    setForm((prev) => ({...prev, [name] : value}));
  }

  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const { error } = schema.validate(form, { abortEarly: false });

    const validationErrors = {};
    if (error) {
      for (let i = 0; i < error.details.length; i++) {
        validationErrors[error.details[i].path[0]] = error.details[i].message;
      }
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length > 0 ? validationErrors : null;
  }

  let submitHadnler = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (errors) return;

    try {
      const data = await login(form).unwrap();
      const accessToken = data?.data?.accessToken;
      const role = data?.data?.user?.role;

      if (role === 'user') {
        toast.error('Access denied. Admins only.');
        await logout().unwrap().catch(() => {});
        return;
      }

      if (accessToken) {
        Cookies.set('accessToken', accessToken);
        setForm({ email: '', password: '' });
        router.push('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Card */}
      <div className="relative w-full max-w-md">
        {/* Top accent line */}
        <div className="h-[2px] w-full rounded-t-xl bg-linear-to-r from-transparent via-purple-500 to-transparent mb-0" />
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-b-xl rounded-t-none shadow-2xl px-8 py-10">
          {/* Logo / Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-4 shadow-lg shadow-purple-900/20">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
              Welcome back
            </h1>
            <p className="text-sm text-[#666] mt-1">Sign in to your dashboard</p>
          </div>
          {isError && error && <div className='alert alert-danger mt-2' >{error?.data?.message}</div>}
          {/* Form */}
          <form onSubmit={submitHadnler} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#888] uppercase tracking-widest">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChangeHandler}
                  placeholder="name@example.com"
                  className="w-full bg-[#111] border border-[#2a2a2a] text-white placeholder-[#444] rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all duration-200"
                />
                {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
              </div>
            </div>
            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[#888] uppercase tracking-widest">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={onChangeHandler}
                  placeholder="••••••••"
                  className="w-full bg-[#111] border border-[#2a2a2a] text-white placeholder-[#444] rounded-lg pl-10 pr-11 py-3 text-sm outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all duration-200"
                />
                {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#888] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3 text-sm transition-all duration-200 shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 active:scale-[0.98] mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Signing in...</span>
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}