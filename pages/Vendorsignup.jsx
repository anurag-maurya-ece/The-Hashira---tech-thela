import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { auth } from '../utilities/firebase';

export default function VendorSignup() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);

  const isNameValid = firstName.trim().length >= 2;
  const isPhoneValid = /^\d{10}$/.test(phone);
  const isPasswordValid = password.length >= 6;
  const isPincodeValid = /^\d{6}$/.test(pincode);
  const isFormValid = isNameValid && isPhoneValid && isPasswordValid && isPincodeValid;

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Please fill valid details before signing up.");
      return;
    }
    setLoading(true);

    try {
      const payload = [{ firstName, phone, password, pincode }];
      const res = await fetch("/api/vendor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Signup failed");

      toast.success("Vendor account created. Please choose a plan.");
      setTimeout(() => router.push(`/Vendorplans?phone=${phone}`), 800);
    } catch (error) {
      toast.error("Could not create vendor account. Phone may already exist.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Navbar />
      <section className="min-h-screen flex items-stretch bg-[#0F0F0F] text-white pt-20">
        {/* Left Side: Hero Section */}
        <div className="lg:flex w-1/2 hidden bg-zinc-900 bg-no-repeat bg-cover relative items-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop')" }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0"></div>
          <div className="w-full px-24 z-10">
            <h1 className="text-6xl font-black text-left tracking-tight mb-4">
              Your Journey <span className="text-emerald-500">Starts</span> Here.
            </h1>
            <p className="text-2xl text-zinc-300 font-medium">
              Join the Tech Thela family as a vendor and start reaching customers globally.
            </p>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="lg:w-1/2 w-full flex items-center justify-center bg-[#0F0F0F] px-4 md:px-16 z-0 relative">
          <div className="w-full max-w-md py-8">
            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-2 tracking-tight text-glow text-emerald-500">Vendor Sign Up</h2>
              <p className="text-zinc-500 font-medium font-inter">Register your business in minutes</p>
            </div>


            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Business Name</label>
                <input 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  required 
                  placeholder="e.g. Fresh Veggies Mart" 
                  className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-700 focus:border-emerald-500/50 outline-none transition-all font-inter" 
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Phone Number</label>
                <input 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                  type="tel" 
                  placeholder="10-digit number" 
                  className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-700 focus:border-emerald-500/50 outline-none transition-all font-inter" 
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Password</label>
                <input 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  type="password" 
                  placeholder="Min. 6 characters" 
                  className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-700 focus:border-emerald-500/50 outline-none transition-all font-inter" 
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Pincode</label>
                <input 
                  value={pincode} 
                  onChange={(e) => setPincode(e.target.value)} 
                  required 
                  type="number" 
                  placeholder="6-digit area code" 
                  className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-700 focus:border-emerald-500/50 outline-none transition-all font-inter" 
                />
              </div>

              <button 
                disabled={loading || !isFormValid} 
                className="w-full p-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black tracking-widest uppercase shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-50 mt-6 h-16 flex items-center justify-center text-lg"
              >
                {loading ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : "Start Business Today"}
              </button>
            </form>

            <p className="text-zinc-500 mt-10 text-center font-medium font-inter">
              Already joined the network? <Link href="/Vendorlogin" className="text-emerald-500 font-black hover:underline underline-offset-4">Sign in here</Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
      <Toaster />
    </>
  );
}
