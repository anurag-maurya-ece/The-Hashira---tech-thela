import Head from "next/head";
import Image from "next/image";
import UpdateCart from "../../components/UpdateCart";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Leaderboard from "../../components/Leaderboard";
import LocateCustomer from "../../components/LocateCustomer.js";
import VendorLocationTracker from "../../components/VendorLocationTracker";
import VendorPingAlerts from "../../components/VendorPingAlerts";
import PreOrderForm from "../../components/PreOrderForm";
import { useState } from 'react';
import Vendor from "../../models/Vendor";
import Reviews from "../../models/Reviews";
import {useRouter} from "next/router";
import mongoose from "mongoose";
import ReviewsForVendor from "@/components/ReviewsForVendor";
import { FiAward, FiMapPin, FiShoppingCart, FiTrendingUp, FiBell } from "react-icons/fi";
import Ping from "../../models/Ping";

export default function Slug({Users, reviews, pingCount}) {
  const [component, setcomponent] = useState('locate customer')
  const [vendor, setVendor] = useState(Users);
  const router = useRouter();
  const { slug } = router.query;

  const toggleStatus = async () => {
    const toast = (await import('react-hot-toast')).default;
    const newStatus = !vendor.isActive;
    
    const loadingToast = toast.loading(newStatus ? "Going Online..." : "Going Offline...");
    
    try {
      // For initial toggle, we use last known coords or default [77, 28]
      const lat = vendor.location?.coordinates[1] || 28.7041;
      const lng = vendor.location?.coordinates[0] || 77.1025;

      const res = await fetch("/api/vendor/update-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone: slug, 
          isActive: newStatus,
          latitude: lat,
          longitude: lng
        }),
      });

      const data = await res.json();
      if (data.success) {
        setVendor({ ...vendor, isActive: newStatus });
        toast.success(newStatus ? "You are now ONLINE" : "You are now OFFLINE", { id: loadingToast });
      } else {
        toast.error("Failed to update status", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Connection Error", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-slate-200 selection:bg-emerald-500/30">
      <Head>
        <title>Tech Thela AI™ | Vendor Dashboard</title>
        <meta name="description" content="Premium dashboard for Tech Thela AI vendors" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <div className="max-w-[1700px] mx-auto pt-20 sm:pt-24 md:pt-32 px-3 sm:px-4 md:px-6 lg:px-8 pb-8 sm:pb-12">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          
          {/* Left Column: Premium Sidebar */}
          <div className="w-full sm:w-[280px] md:w-[320px] lg:w-[320px] shrink-0">
            <div className="sticky top-24 sm:top-28 md:top-32">
              <Sidebar Users={vendor} component={setcomponent} />
            </div>
          </div>

          {/* Right Column: Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* Header / Top Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
              {/* Account Status Card */}
              <div 
                onClick={() => router.push(`/Vendorplans?phone=${slug}`)}
                className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative cursor-pointer active:scale-95"
              >
                <div className="absolute top-0 right-0 p-2 sm:p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <FiAward size={40} className="sm:w-12 sm:h-12 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="relative z-10">
                  <p className="text-slate-500 dark:text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">Account Status</p>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">
                    {vendor?.subscriptionStatus === "active" ? "Active" : "Inactive"}
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${vendor?.subscriptionStatus === "active" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
                    <span className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-tight ${vendor?.subscriptionStatus === "active" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}`}>
                      {vendor?.subscriptionLabel || vendor?.subscriptionPlan || "No Plan"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Location Card */}
              <div 
                onClick={toggleStatus}
                className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative cursor-pointer active:scale-95"
              >
                <div className="absolute top-0 right-0 p-2 sm:p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <FiMapPin size={40} className="sm:w-12 sm:h-12 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="relative z-10">
                  <p className="text-slate-500 dark:text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">Live Location</p>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white truncate">
                    {vendor?.isActive ? (vendor?.location?.coordinates[0] !== 0 ? "Tracking" : "Online") : "Offline"}
                  </h3>
                  <p className={`text-[8px] sm:text-[10px] font-bold mt-2 uppercase tracking-tight flex items-center gap-1 ${vendor.isActive ? "text-blue-600" : "text-slate-400"}`}>
                    <FiTrendingUp className={vendor.isActive ? "rotate-45" : ""} /> {vendor.isActive ? "Signal Strong" : "Disconnected"}
                  </p>
                </div>
              </div>

              {/* Smart Order Routing Card */}
              <div 
                onClick={toggleStatus}
                className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative cursor-pointer active:scale-95"
              >
                <div className="absolute top-0 right-0 p-2 sm:p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <FiShoppingCart size={40} className="sm:w-12 sm:h-12 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="relative z-10">
                  <p className="text-slate-500 dark:text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">Smart Routing</p>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">
                    {vendor?.isActive ? "Enabled" : "Disabled"}
                  </h3>
                  <p className={`text-[8px] sm:text-[10px] font-bold mt-2 uppercase tracking-tight ${vendor.isActive ? "text-amber-600" : "text-slate-400"}`}>
                    {vendor.isActive ? "AI Optimizing..." : "Turn ON to sync"}
                  </p>
                </div>
              </div>

              {/* Market Insights Card */}
              <div 
                onClick={() => setcomponent("demand alerts")}
                className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative cursor-pointer active:scale-95"
              >
                <div className="absolute top-0 right-0 p-2 sm:p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <FiBell size={40} className="sm:w-12 sm:h-12 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="relative z-10">
                  <p className="text-slate-500 dark:text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">Market Insights</p>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">{pingCount || 0} New</h3>
                  <p className="text-[8px] sm:text-[10px] font-bold text-purple-600 dark:text-purple-400 mt-2 uppercase tracking-tight italic">Customer Alerts</p>
                </div>
              </div>
            </div>

            {/* Dynamic Content Component Wrap */}
            <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl sm:rounded-3xl lg:rounded-[40px] p-4 sm:p-6 md:p-8 lg:p-10 shadow-xl dark:shadow-2xl min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] transition-all">
              {component === "locate customer" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <LocateCustomer Users={vendor} onUpdateVendor={setVendor} />
                </div>
              )}
              {component === "leaderboard" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <Leaderboard Users={Users} />
                </div>
              )}
              {component === "update" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <UpdateCart vendorPhone={slug} />
                </div>
              )}
              {component === "reviews" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <ReviewsForVendor reviews={reviews} Users={Users} />
                </div>
              )}
              {component === "demand alerts" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <VendorPingAlerts vendorPhone={slug} />
                </div>
              )}
              {component === "preorder" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <PreOrderForm vendorPhone={slug} />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URL);
  }

  let Users = await Vendor.findOne({ phone: context.query.slug });

  if (!Users) {
    return {
      redirect: {
        destination: '/Vendorlogin',
        permanent: false,
      },
    };
  }

  const reviews = await Reviews.find({ vendornumber: Users._id });
  
  // Fetch real-time ping count (pending customer alerts)
  const pingCount = await Ping.countDocuments({ status: "pending" });

  return {
    props: {
      Users: JSON.parse(JSON.stringify(Users)),
      reviews: JSON.parse(JSON.stringify(reviews)),
      pingCount: pingCount || 0,
    },
  };
}

