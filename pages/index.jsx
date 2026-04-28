import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from '@next/font/google'
import AboutDataTemplate from "../components/AboutDataCard";
import { sectionData } from "../utilities/data";
import LoginCard from '../components/LoginCards';
import Navbar from '../components/Navbar';
import ReviewCarousel from "../components/ReviewCarousel";

import mongoose from "mongoose";
import { GetServerSideProps } from 'next';
import Reviews from "../models/Reviews";
import Revi from "../models/Revi";
import { useLanguage } from "../utilities/i18n";

const inter = Inter({ subsets: ['latin'] })
const renderAboutData = sectionData.map((data, index) => (
  <AboutDataTemplate
    key={index}
    start={data.start}
    picImg={data.picImg}
    number={data.number}
    title={data.title}
  />
));

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-[#0A0A0A] text-[#4B5563] dark:text-[#F3F4F6] min-h-screen transition-colors duration-500 overflow-x-hidden font-public-sans">
      <Head>
        <title>Tech Thela™</title>
        <meta name="description" content="perfect for vendors" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Navbar />


      {/* main hero section starts */}
      <section className="flex flex-col md:flex-row justify-center min-h-[90vh] items-center px-6 sm:px-10 md:px-20 gap-8 py-10 pt-24 sm:pt-32 lg:pt-40 relative overflow-hidden"> 
        {/* Matrix Dark Mode Grid Overlay */}
        <div className="hidden dark:block absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(to right, #10B981 1px, transparent 1px), linear-gradient(to bottom, #10B981 1px, transparent 1px)', backgroundSize: '40px 40px', WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 70%, transparent 100%)' }}></div>
        
        {/* Floating Geometric Shapes - Adjusted for mobile */}
        <div className="absolute top-20 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-[#DCFCE7] dark:bg-[#10B981]/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-float" style={{ animationDelay: '0s', animationDuration: '7s' }}></div>
        <div className="absolute top-40 right-10 w-32 h-32 sm:w-48 sm:h-48 bg-[#DCFCE7] dark:bg-[#ADFF2F]/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-80 animate-float" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 sm:w-40 sm:h-40 bg-[#DCFCE7] dark:bg-[#047857]/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-60 animate-float" style={{ animationDelay: '4s', animationDuration: '9s' }}></div>

        <div className='flex flex-col justify-center gap-6 sm:gap-8 w-full md:max-w-[45vw] z-10 text-center md:text-left'>
          <h5 className='text-xs sm:text-sm text-[#16A34A] dark:text-[#10B981] font-bold tracking-widest uppercase font-public-sans'>{t("hero.badge")}</h5>

          <h3 className='text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#111111] dark:text-white leading-tight'>
            {t("hero.title.prefix")} <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#15803d] dark:from-[#047857] dark:to-[#ADFF2F]'>{t("hero.title.trust")} <svg className="inline w-5 h-5 sm:w-8 sm:h-8 -mt-1 text-[#16A34A] dark:text-[#10B981]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg></span> {t("hero.title.with")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#15803d] dark:from-[#047857] dark:to-[#ADFF2F]">{t("hero.title.technology")} <svg className="inline w-5 h-5 sm:w-8 sm:h-8 -mt-1 text-[#16A34A] dark:text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg></span> {t("hero.title.and")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#15803d] dark:from-[#047857] dark:to-[#ADFF2F]">{t("hero.title.love")}</span>
          </h3>
          <h5 className='text-lg sm:text-xl text-[#4B5563] dark:text-gray-400 font-public-sans leading-relaxed'>{t("hero.subtitle")}</h5>
          
          <div className="pt-2 sm:pt-4">
            <Link href="#cardssection">
              <button className="w-full sm:w-auto bg-[#16A34A] dark:bg-gradient-to-r dark:from-[#047857] dark:to-[#10B981] text-[#FFFFFF] font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl dark:shadow-[0_4px_20px_0_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all duration-300">
                {t("hero.getStarted")}
              </button>
            </Link>
          </div>
        </div>

        <div className='w-full md:w-[50vw] flex items-center justify-center relative pl-0 md:pl-10 mt-8 md:mt-0'>
          <div className="absolute inset-0 bg-[#DCFCE7]/50 dark:bg-[#10B981]/10 rounded-full blur-3xl opacity-60 dark:opacity-30 scale-[1.2] sm:scale-[1.35]"></div>
          <Image 
            src={"/assets/herosec.gif"}
            width={1200}
            height={1200} 
            unoptimized={true}
            className="w-full h-auto relative z-10 drop-shadow-2xl object-contain mix-blend-multiply dark:mix-blend-screen dark:invert dark:opacity-90 max-w-[90%] sm:max-w-full"
            style={{ 
              height: 'auto', 
              maxHeight: '60vh',
              WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 60%, transparent 100%)',
              maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 60%, transparent 100%)'
            }}
            alt="Hero Illustration"
          />
        </div>
      </section>
      {/* main hero section ends */}

      {/* stats section starts */}
      <section className="bg-gray-50/50 backdrop-blur-sm dark:bg-[#050505] border-y border-gray-100 dark:border-[#10B981]/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-6 sm:px-10 py-10 sm:py-16 w-full gap-8 transition-colors">
      {renderAboutData}
      </section>
      {/* stats section ends */}

      {/* login for vendor and consumer starts */}
      <section className='bg-white dark:bg-[#0A0A0A] px-4 md:px-32 py-16 sm:py-24 transition-colors relative'>
        <div id="cardssection" className='rounded-3xl bg-gray-50 dark:bg-[#1F2937]/50 dark:backdrop-blur-xl border border-gray-100 dark:border-[#10B981]/20 shadow-sm px-4 md:px-24 flex flex-col items-center text-center pb-24 sm:pb-32 pt-16 sm:pt-20 transition-colors'>
          <p className='text-3xl sm:text-5xl md:text-6xl font-extrabold mb-8 sm:mb-10 leading-tight text-[#111111] dark:text-white'>
            {t("cards.heading.prefix")} <span className='text-[#111111] dark:text-[#10B981]'>{t("cards.heading.highlightA")} </span><span className='text-[#16A34A] dark:text-white'>{t("cards.heading.highlightB")}</span>
          </p>
        </div>
        
        <div className='flex flex-col md:flex-row gap-6 md:gap-16 justify-center w-full z-10 relative -mt-12 sm:-mt-16'>
          <LoginCard imgName="consumer" name="Customer" text={t("cards.customer")} />
          <LoginCard imgName="vendor" name="Vendor" text={t("cards.vendor")} />
        </div>
      </section> 
      {/* login for vendor and consumer ends */}

      {/* Student Feedback Carousel Starts */}
      <div className="bg-white dark:bg-[#0A0A0A] flex flex-col gap-10 w-full md:w-4/5 py-12 mx-auto relative transition-colors">
        <div className="flex flex-col gap-2">
          <div className="xl:text-5xl text-4xl font-extrabold text-[#111111] dark:text-white">
            <h1 className="text-center">{t("reviews.title")}</h1>
          </div>
          <p className="text-[#4B5563] dark:text-[#F3F4F6] text-lg font-public-sans text-center">
            {t("reviews.subtitle")}
          </p>
        </div>
        <ReviewCarousel />
      </div>
      {/* Student Feedback Carousel Ends */}
    </div>
  )
}

export const getServerSideProps = async (context) => {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URL);
  }

  let Rev = await Reviews.find(); // You need to have Reviews imported and defined here
  // let Revs = await Revi.find(); // This line seems to be commented out, so no issue here
  
  return {
    props: { Rev: JSON.parse(JSON.stringify(Rev)) },
  };
};
