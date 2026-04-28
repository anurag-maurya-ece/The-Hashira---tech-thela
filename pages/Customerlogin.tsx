import { signIn } from 'next-auth/react'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useRouter } from 'next/router'
import Link from 'next/link'
import { auth } from '../utilities/firebase'

export default function Customerlogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }

    setLoading(true)
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success('Login Successful! Welcome back.')
        router.push('/form')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <section className="min-h-screen flex items-stretch bg-[#0f0f0f] text-white pt-20 md:pt-24 select-none">
        {/* Left Side: Visual Hero */}
        <div className="lg:flex w-1/2 hidden bg-gray-900 bg-no-repeat bg-cover relative items-center overflow-hidden" style={{ backgroundImage: "url('/assets/customer_login.png')" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10"></div>
          <div className="w-full px-24 z-20 animate-in slide-in-from-left duration-700">
            <h1 className="text-6xl font-black text-left tracking-tighter leading-none mb-6">
              Empowering your <br />
              <span className="text-emerald-500">Fresh</span> Journey.
            </h1>
            <p className="text-xl text-gray-300 font-medium max-w-md leading-relaxed">
              Experience the future of farm-to-table with Tech Thela AI. 
              Authentic, reliable, and faster than ever.
            </p>
          </div>
          {/* Subtle micro-animation element */}
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:w-1/2 w-full flex items-center justify-center relative z-0 bg-zinc-950 px-6 md:px-16 transition-all duration-500">
          {/* Mobile Background Overlay */}
          <div className="absolute lg:hidden z-0 inset-0 bg-no-repeat bg-cover" style={{ backgroundImage: "url('/assets/customer_login.png')" }}>
            <div className="absolute bg-[#0f0f0f]/90 inset-0 z-0"></div>
          </div>

          <div className="w-full max-w-md py-12 z-20 animate-in fade-in zoom-in duration-500">
             {/* Logo Section */}
            <div className="mb-10 flex flex-col items-center">
              <div className="bg-white/5 p-4 rounded-3xl shadow-2xl backdrop-blur-md border border-white/10 mb-6 hover:scale-110 transition-transform">
                <Image src="/assets/tech thela logo.png" width={180} height={50} alt="Tech Thela Logo" className="h-10 w-auto object-contain" />
              </div>
              <h2 className="text-2xl font-black tracking-tight">Welcome Back!</h2>
              <p className="text-gray-400 font-medium text-sm mt-1">Sign in to continue your journey</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleCredentialsLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-gray-500 ml-4 tracking-widest">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white/10 outline-none font-bold transition-all placeholder:text-gray-600"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-4">
                  <label className="text-xs font-black uppercase text-gray-500 tracking-widest">Password</label>
                  <Link href="#" className="text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors mr-2">Forgot?</Link>
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white/10 outline-none font-bold transition-all placeholder:text-gray-600"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-4 rounded-2xl font-black text-lg transition-all active:scale-95 disabled:opacity-50 mt-4 shadow-[0_10px_30px_rgba(16,185,129,0.2)]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : "Sign In"}
              </button>
            </form>

            {/* Footer Text */}
            <p className="text-center text-gray-400 mt-10 text-sm font-medium">
              New to Tech Thela?{" "}
              <Link href="/Customersignup" className="text-emerald-500 hover:text-emerald-400 font-black transition-colors underline underline-offset-4">
                Join as Customer
              </Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
      <Toaster position="bottom-center" />
    </>
  );
}
