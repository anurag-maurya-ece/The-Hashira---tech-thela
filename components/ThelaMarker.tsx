import React from 'react';
import { motion } from 'framer-motion';

interface ThelaProps {
  type?: string;
  name?: string;
  isUser?: boolean;
}

const ThelaMarker: React.FC<ThelaProps> = ({ type, name, isUser = false }) => (
  <div className="relative w-12 h-12 flex items-center justify-center">
    {/* Shadow */}
    <div className="absolute bottom-1 w-8 h-2 bg-black/10 rounded-full blur-[2px]" />
    
    <motion.div
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className="relative z-10"
    >
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        {/* Cart Body */}
        <path d="M5 25 L35 25 L38 10 L2 10 Z" fill={isUser ? "#4F46E5" : "#D97706"} stroke="#451A03" strokeWidth="2" />
        {/* Wheels */}
        <circle cx="10" cy="30" r="4" fill="#1F2937" stroke="#451A03" strokeWidth="1" />
        <circle cx="30" cy="30" r="4" fill="#1F2937" stroke="#451A03" strokeWidth="1" />
        {/* Roof */}
        <path d="M0 10 Q20 0 40 10" stroke={isUser ? "#4338CA" : "#B45309"} strokeWidth="3" fill="none" />
      </svg>
      
      {/* Category Overlay */}
      {!isUser && (
        <div className="absolute top-0 right-0 bg-white rounded-full p-1 shadow-md border border-slate-100 scale-75">
          {type === 'Vegetables' ? '🥦' : type === 'Fruits' ? '🍎' : '🍔'}
        </div>
      )}
      
      {/* Name Label */}
      <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full text-[8px] font-black shadow-sm border ${isUser ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/90 text-slate-800 border-indigo-50'}`}>
        {name?.split(' ')[0] || (isUser ? 'YOU' : 'VENDOR')}
      </div>
    </motion.div>
  </div>
);

export default ThelaMarker;
