import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  imgName: string;
  name: string;
  text: string;
};

const LoginCard = (props: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`flex flex-col gap-4 sm:gap-6 items-center py-8 sm:py-12 md:py-14 bg-white dark:bg-[#1F2937]/50 dark:backdrop-blur-md rounded-2xl px-4 sm:px-8 md:px-12 text-center justify-center w-full sm:w-80 md:w-96 lg:w-[420px] shadow-sm border border-gray-100 dark:border-[#10B981]/20 hover:border-[#16A34A] hover:shadow-[0_15px_50px_-10px_rgba(22,163,74,0.15)] dark:hover:border-[#10B981] dark:hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] transition-all duration-700 z-20 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
    >
      <div className="relative w-full flex justify-center mb-2 sm:mb-4 transition-transform hover:scale-105 duration-500 min-h-[180px] sm:min-h-[220px] md:min-h-[250px] items-center" style={{ filter: "drop-shadow(0 15px 25px rgba(22, 163, 74, 0.2))" }}>
        <Image src={`/assets/${props.imgName}.png`} width={350} height={350} alt="" className="w-full h-auto object-contain drop-shadow-xl dark:drop-shadow-[0_10px_15px_rgba(16,185,129,0.2)]" style={{ maxWidth: '280px', maxHeight: '220px', height: 'auto' }} />
      </div>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111111] dark:text-white">
        Are you a <span className="text-[#16A34A] dark:text-[#10B981]">{props.name}</span>?
      </h2>
      <h5 className="text-xs sm:text-sm md:text-base text-[#4B5563] dark:text-[#F3F4F6] font-medium font-public-sans leading-relaxed">{props.text}</h5>
      <a href={props.name === 'Vendor' ? '/Vendorlogin' : '/Customerlogin'} className="w-full mt-2 sm:mt-4">
        <button className="w-full text-sm sm:text-base md:text-lg bg-[#16A34A] dark:bg-gradient-to-r dark:from-[#047857] dark:to-[#10B981] text-[#FFFFFF] dark:text-white font-bold px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-md shadow-[#16A34A]/20 dark:shadow-[0_4px_14px_0_rgba(16,185,129,0.3)] hover:bg-[#15803d] hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 dark:hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]">
          Join now
        </button>
      </a>
    </div>
  );
};

export default LoginCard;
