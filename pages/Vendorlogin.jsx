import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import toast, { Toaster } from 'react-hot-toast'
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from 'next/link'
import { auth } from '../utilities/firebase';

export default function Vendorlogin() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!phone || !password) {
      toast.error('Please enter phone and password');
      return;
    }
    
    setLoading(true);
    const requestBody = JSON.stringify({
      type: "vendor",
      phone: phone,
      password: password,
    });

    try {
      const response = await fetch(`/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody,
      });

      if (response.ok) {
        toast.success('Login Successful');
        router.push(`/Vendor/${phone}`);
      } else {
        toast.error('Login Failed - Invalid Credentials');
      }
    } catch (error) {
      console.error('Login Error:', error);
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Navbar />
      <section className="min-h-screen flex items-stretch bg-[#0F0F0F] text-white pt-20">
        {/* Left Side: Hero Section */}
        <div className="lg:flex w-1/2 hidden bg-zinc-900 bg-no-repeat bg-cover relative items-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488459739036-79ef9bfcae82?q=80&w=2072&auto=format&fit=crop')" }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0"></div>
          <div className="w-full px-24 z-10">
            <h1 className="text-6xl font-black text-left tracking-tight mb-4 leading-tight">
              Grow Your <span className="text-emerald-500 text-glow">Business</span> Faster.
            </h1>
            <p className="text-2xl text-zinc-300 font-medium">
              Join the Tech Thela network and connect with thousands of customers in real-time.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:w-1/2 w-full flex items-center justify-center bg-[#0F0F0F] px-4 md:px-16 z-0 relative">
          <div className="w-full max-w-md py-8">
            {/* Logo and Header */}
            <div className="mb-10 text-center lg:text-left">
              <div className="inline-block bg-white px-4 py-2 rounded-xl mb-6 shadow-xl">
                 <Image src="/assets/tech thela logo.png" width={180} height={50} alt="Tech Thela" className="object-contain" />
              </div>
              <h2 className="text-4xl font-black mb-2 tracking-tight">Vendor Login</h2>
              <p className="text-zinc-500 font-medium tracking-wide font-inter">Manage your shop, inventory and tracking</p>
            </div>


            {/* Manual Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Phone Number</label>
                <input 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                  type="tel"
                  placeholder="e.g. 9876543210" 
                  className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-700 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all font-inter text-lg" 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                   <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Password</label>
                   <a href="#" className="text-xs font-bold text-emerald-500 hover:text-emerald-400 hover:underline">Forgot?</a>
                </div>
                <input 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-700 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all font-inter text-lg" 
                />
              </div>

              <button 
                type="submit"
                disabled={loading} 
                className="w-full p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black tracking-widest uppercase shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:bg-zinc-800 mt-4 h-16 flex items-center justify-center text-lg"
              >
                {loading ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : "Sign In to Business"}
              </button>
            </form>

            <p className="text-zinc-500 mt-10 text-center font-medium">
              Don&apos;t have a shop yet? <Link href="/Vendorsignup" className="text-emerald-500 font-black hover:underline underline-offset-4">Register as Vendor</Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
      <Toaster />
    </>
  );
}
