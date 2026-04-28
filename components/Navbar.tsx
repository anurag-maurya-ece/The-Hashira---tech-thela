import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, SessionProvider, signOut} from 'next-auth/react'
import { useRouter } from "next/router";
import { languageOptions, useLanguage } from "../utilities/i18n";

export default function Home() {
  const [menuPricing, setMenuPricing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data } = useSession();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
 
  return (
    <>
      <header className="fixed top-4 w-full z-50 flex justify-center px-4 pointer-events-none transition-all duration-300">
        <nav className="pointer-events-auto bg-white/70 dark:bg-[#0B1120]/75 backdrop-blur-2xl border border-gray-200/50 dark:border-white/10 rounded-full px-5 py-2.5 flex justify-between items-center shadow-lg dark:shadow-2xl w-full max-w-5xl transition-all duration-300">
          
          {/* Logo */}
          <Link href={"/"} className="flex items-center group -my-4 sm:-my-6">
            <Image 
              src="/assets/tech thela logo.png" 
              width={400} 
              height={120} 
              alt="Tech Thela AI Logo" 
              className="h-12 w-auto sm:h-16 md:h-20 object-contain transition-transform duration-300 group-hover:scale-105" 
            />
          </Link>

          {/* Center Pill Links (Desktop) */}
          <div className="hidden md:flex items-center bg-gray-100/50 dark:bg-white/5 rounded-full p-1 border border-transparent dark:border-white/5 shadow-inner">
            <Link
              href={"/"}
              className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                router.pathname === '/' 
                  ? 'bg-white dark:bg-white/10 text-[#111111] dark:text-white shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-white/5'
              }`}
            >
              {t("nav.home")}
            </Link>
            <Link
              href={"/Enterprise"}
              className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                router.pathname === '/Enterprise' 
                  ? 'bg-white dark:bg-white/10 text-[#111111] dark:text-white shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-white/5'
              }`}
            >
              {t("nav.enterprise")}
            </Link>
            <Link
              href={"/aboutus"}
              className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                router.pathname === '/aboutus' 
                  ? 'bg-white dark:bg-white/10 text-[#111111] dark:text-white shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-white/5'
              }`}
            >
              {t("nav.about")}
            </Link>
            
            {/* Services Dropdown Container */}
            <div 
              className="relative"
              onMouseEnter={() => setMenuPricing(true)}
              onMouseLeave={() => setMenuPricing(false)}
            >
              <button
                className={`flex items-center px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                  menuPricing 
                    ? 'bg-white dark:bg-white/10 text-[#111111] dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-white/5'
                }`}
              >
                {t("nav.services")}
                <svg className={`ml-1.5 w-4 h-4 transition-transform duration-300 ${menuPricing ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>

              {/* Mega Menu Dropdown */}
              <div 
                className={`absolute top-full tracking-normal left-1/2 transform -translate-x-1/2 mt-6 w-[550px] z-50 transition-all duration-400 origin-top pointer-events-none ${
                    menuPricing ? "opacity-100 scale-100 translate-y-0 visible pointer-events-auto" : "opacity-0 scale-95 -translate-y-4 invisible"
                }`}
              >
                {/* Transparent Bridge for hover gap */}
                <div className="absolute -top-8 left-0 right-0 h-10 bg-transparent" />
                
                <div className="bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-3xl border border-gray-100/80 dark:border-white/10 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] p-4 overflow-hidden text-left">
                  <div className="grid sm:grid-cols-2 gap-2">
                    <Link href={"/vendorpricing"} className="block p-5 rounded-3xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group border border-transparent hover:border-gray-100 dark:hover:border-white/5">
                      <div className="flex items-center gap-3 mb-2">
                         <div className="p-2.5 bg-green-50 dark:bg-[#16A34A]/20 rounded-full text-[#16A34A] dark:text-[#ADFF2F] group-hover:scale-110 transition-transform duration-500">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                         </div>
                         <div className="font-bold text-[#111111] dark:text-white transition-colors">{t("nav.vendorPricing")}</div>
                      </div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400/80 leading-relaxed">
                        Join our network of elite transport providers. Scale operations seamlessly.
                      </p>
                    </Link>
                    <Link href={"/customerpricing"} className="block p-5 rounded-3xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group border border-transparent hover:border-gray-100 dark:hover:border-white/5">
                      <div className="flex items-center gap-3 mb-2">
                         <div className="p-2.5 bg-blue-50 dark:bg-[#38BDF8]/20 rounded-full text-blue-600 dark:text-[#38BDF8] group-hover:scale-110 transition-transform duration-500">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                         </div>
                         <div className="font-bold text-[#111111] dark:text-white transition-colors">{t("nav.consumerLogistics")}</div>
                      </div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400/80 leading-relaxed">
                        Effortlessly track and organize multiple shipments securely.
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden xl:flex items-center gap-2">
              <label htmlFor="language-switcher" className="text-xs text-gray-500 dark:text-gray-400">
                {t("nav.language")}
              </label>
              <select
                id="language-switcher"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-full border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0B1120] text-xs px-3 py-1.5 text-gray-700 dark:text-gray-200"
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              className="p-2.5 rounded-full bg-gray-100/80 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-all duration-300 shadow-sm"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'light' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              )}
            </button>

            {/* Premium Gradient Button ("Say Hello" style) */}
            <Link href="/#cardssection" className="hidden lg:block">
              <div className="relative rounded-full p-[2px] bg-gradient-to-r from-cyan-400 via-purple-500 to-orange-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-500 hover:scale-105 active:scale-95 group overflow-hidden">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-[#0B1120] px-6 py-2 transition-all duration-300 group-hover:bg-opacity-0 dark:group-hover:bg-opacity-0">
                   <span className="font-bold text-[#111111] dark:text-white group-hover:text-white text-sm tracking-wide transition-colors">{t("nav.joinNow")}</span>
                </div>
              </div>
            </Link>

            {/* Mobile Hamburger overlay */}
            <button 
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-500 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleMobileMenu}
      />

      {/* Mobile Drawer Panel */}
      <div className={`fixed top-0 right-0 w-[300px] h-full bg-white dark:bg-[#0B1120] z-[70] shadow-2xl transition-transform duration-500 ease-in-out md:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-white/5">
          <Link href={"/"} onClick={toggleMobileMenu}>
            <Image 
              src="/assets/tech thela logo.png" 
              width={150} 
              height={50} 
              alt="Tech Thela AI Logo" 
              className="h-8 sm:h-10 w-auto object-contain" 
            />
          </Link>
          <button onClick={toggleMobileMenu} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
            <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-4">
          <Link href="/" onClick={toggleMobileMenu} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-[#111111] dark:text-white font-bold text-lg">
            <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            </div>
            {t("nav.home")}
          </Link>
          <Link href="/Enterprise" onClick={toggleMobileMenu} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-[#111111] dark:text-white font-bold text-lg">
            <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
            {t("nav.enterprise")}
          </Link>
          <Link href="/aboutus" onClick={toggleMobileMenu} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-[#111111] dark:text-white font-bold text-lg">
            <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            {t("nav.about")}
          </Link>

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex flex-col gap-4">
             <div className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">{t("nav.services")}</div>
             <Link href="/vendorpricing" onClick={toggleMobileMenu} className="flex items-center gap-3 p-4 rounded-2xl bg-green-50/50 dark:bg-green-500/10 text-[#16A34A] dark:text-[#ADFF2F] font-bold">
                {t("nav.vendorPricing")}
             </Link>
             <Link href="/customerpricing" onClick={toggleMobileMenu} className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-500/10 text-blue-600 dark:text-[#38BDF8] font-bold">
                {t("nav.consumerLogistics")}
             </Link>
          </div>
        </div>

        <div className="p-8 border-t border-gray-100 dark:border-white/5 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400 font-medium">{t("nav.language")}</span>
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm px-4 py-2 text-gray-700 dark:text-gray-200"
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
          </div>
          
          <Link href="/#cardssection" onClick={toggleMobileMenu}>
            <div className="w-full rounded-2xl p-[2px] bg-gradient-to-r from-cyan-400 via-purple-500 to-orange-400">
               <div className="flex w-full items-center justify-center rounded-2xl bg-white dark:bg-[#0B1120] px-6 py-4 transition-all">
                  <span className="font-bold text-[#111111] dark:text-white text-lg tracking-wide">{t("nav.joinNow")}</span>
               </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}


