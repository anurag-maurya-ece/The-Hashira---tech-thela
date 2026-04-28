import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { auth } from '../utilities/firebase';

export default function CustomerSignup() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);

  const isPasswordValid = password.length >= 6;
  const isPincodeValid = /^\d{6}$/.test(pincode);
  const isNameValid = firstName.trim().length >= 2;
  const isAddressValid = address.trim().length >= 5;
  const isFormValid = isNameValid && email.trim().length > 3 && isPasswordValid && isAddressValid && isPincodeValid;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("Please fill valid details before signing up.");
      return;
    }
    setLoading(true);

    try {
      const payload = [
        {
          firstName,
          email,
          password,
          address,
          pincode,
          isuser: true,
        },
      ];

      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Signup failed");
      }

      toast.success("Signup successful. Please login now.");
      setTimeout(() => router.push("/Customerlogin"), 800);
    } catch (error) {
      toast.error("Could not create account. Try another email.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Navbar />
      <section className="min-h-screen flex items-stretch bg-[#0F0F0F] text-white pt-20">
        <div className="lg:flex w-1/2 hidden bg-zinc-900 bg-no-repeat bg-cover relative items-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop')" }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0"></div>
          <div className="w-full px-24 z-10">
            <h1 className="text-6xl font-black text-left tracking-tight mb-4">
              Join the <span className="text-emerald-500">Fresh</span> Revolution.
            </h1>
            <p className="text-2xl text-zinc-300 font-medium">
              Join millions of happy customers getting fresh produce delivered straight from the cart.
            </p>
          </div>
        </div>

        <div className="lg:w-1/2 w-full flex items-center justify-center bg-[#0F0F0F] px-4 md:px-16 z-0 relative">
          <div className="w-full max-w-md py-8">
            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-2">Create Account</h2>
              <p className="text-zinc-400 font-medium font-inter">Start your journey with Tech Thela AI today.</p>
            </div>


            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  required 
                  placeholder="Full Name" 
                  className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all font-inter" 
                />
                <input 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all font-inter" 
                />
              </div>
              
              <input 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                type="password" 
                placeholder="Secure Password" 
                className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all font-inter" 
              />
              
              <input 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                required 
                placeholder="Delivery Address" 
                className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all font-inter" 
              />
              
              <input 
                value={pincode} 
                onChange={(e) => setPincode(e.target.value)} 
                required 
                type="number" 
                placeholder="Pincode" 
                className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all font-inter" 
              />

              <button 
                disabled={loading || !isFormValid} 
                className="w-full p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black tracking-widest uppercase shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:bg-zinc-800"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="text-zinc-400 mt-8 text-center font-medium">
              Already have an account? <Link href="/Customerlogin" className="text-emerald-500 font-bold hover:underline underline-offset-4">Sign in</Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
      <Toaster />
    </>
  );
}
