import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const PaymentScanner = ({ vendorName = "Vendor" }) => {
  const [step, setStep] = useState('scan'); // scan, process, success
  const router = useRouter();

  useEffect(() => {
    // Stage 1: Scanning (2.5s)
    const scanTimeout = setTimeout(() => {
      setStep('process');
      // Stage 2: Processing (1.5s)
      setTimeout(() => {
        setStep('success');
        toast.success("Payment Received!", {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#10B981',
            color: '#fff',
            fontWeight: 'bold',
          }
        });
        // Stage 3: Success & Redirect (3.5s)
        setTimeout(() => {
          router.push('/Customer');
        }, 3500);
      }, 1500);
    }, 2500);

    return () => clearTimeout(scanTimeout);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <AnimatePresence mode="wait">
        {step === 'scan' && (
          <motion.div
            key="scan"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-64 h-64 border-4 border-dashed border-[#fc6441] rounded-3xl flex items-center justify-center overflow-hidden bg-gray-50">
              <img src="/qr-placeholder.png" alt="QR" className="w-48 h-48 opacity-20 grayscale" 
                   onError={(e) => { e.currentTarget.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TechThelaAI-Demo"; }} />
              
              {/* Scanning Line Animation */}
              <motion.div
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-[#fc6441] shadow-[0_0_15px_#fc6441] z-10"
              />
            </div>
            <h2 className="mt-8 text-2xl font-bold text-gray-700 animate-pulse">
              Scanning QR Code...
            </h2>
            <p className="text-gray-500 mt-2">Paying {vendorName}</p>
          </motion.div>
        )}

        {step === 'process' && (
          <motion.div
            key="process"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 border-4 border-[#fc6441] border-t-transparent rounded-full animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-gray-700">Verifying Transaction</h2>
            <p className="text-gray-500 mt-2 italic px-8">Securing through UPI-Mesh Protocol...</p>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center bg-white p-10 rounded-3xl shadow-2xl border border-green-100"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-200"
            >
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
            
            <h2 className="text-3xl font-extrabold text-gray-800">Payment Successful!</h2>
            <div className="mt-4 bg-green-50 px-6 py-3 rounded-2xl border border-green-100">
              <p className="text-green-700 font-bold text-lg">₹ 450.00</p>
              <p className="text-green-600 text-xs">Transaction ID: WEK-{Math.floor(Math.random()*1000000)}</p>
            </div>
            
            <div className="mt-6 flex gap-2">
              <div className="bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100 flex items-center gap-1">
                <span className="text-lg">✨</span>
                <span className="text-yellow-700 text-sm font-bold">+15 Credits Earned</span>
              </div>
            </div>

            <p className="text-gray-400 mt-8 text-sm">Redirecting to Dashboard...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentScanner;
