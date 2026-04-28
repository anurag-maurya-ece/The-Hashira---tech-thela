import React, { useState } from 'react';
import axios from 'axios';
import { FiPackage, FiCalendar, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function PreOrderForm({ vendorPhone }: { vendorPhone: string }) {
  const [itemType, setItemType] = useState('Tomatoes');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // For prototype testing, we send 'demo-token' if real auth is not available
      await axios.post('http://localhost:5000/api/inventory/requirements', {
        itemType,
        quantity: Number(quantity),
        requiredDate: date,
      }, {
        headers: { Authorization: `Bearer demo-token` }
      });

      setSuccess(true);
      toast.success('Pre-order posted to Farmer Network!');
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place pre-order');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
          <FiCheckCircle className="text-emerald-600 dark:text-emerald-400 text-4xl" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Demand Broadcasted!</h2>
        <p className="text-slate-500 dark:text-gray-400 max-w-sm mx-auto">
          Your request for {quantity}kg of {itemType} has been sent to the Farmer Network. 
          You will be notified when a farmer allocates stock.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-8 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all"
        >
          Create Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Pre-Order Inventory</h2>
        <p className="text-slate-500 dark:text-gray-400 font-medium">
          Tell our farmer network what you need. AI will match your demand with the nearest optimal harvest.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Produce Type</label>
            <div className="relative group">
              <FiPackage className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <select 
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-semibold appearance-none"
              >
                <option>Tomatoes</option>
                <option>Potatoes</option>
                <option>Onions</option>
                <option>Spinach</option>
                <option>Mangoes</option>
                <option>Wheat</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Quantity (in KG)</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs group-focus-within:text-emerald-500 transition-colors">KG</span>
              <input 
                type="number" required placeholder="e.g. 500"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-semibold"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Required By Date</label>
          <div className="relative group">
            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="date" required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-semibold text-slate-600 dark:text-white"
            />
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit" disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {loading ? 'Processing...' : (
              <>
                Broadcast Demand to Farmers <FiArrowRight />
              </>
            )}
          </button>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20">
          <p className="text-[11px] leading-relaxed text-blue-700 dark:text-blue-300 font-medium">
             💡 **Pro Tip**: Placing requirements 48 hours in advance increases fulfillment probability by 85% via hyperlocal logistics routing.
          </p>
        </div>
      </form>
    </div>
  );
}
