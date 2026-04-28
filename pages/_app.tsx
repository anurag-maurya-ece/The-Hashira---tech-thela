import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Footer from '../components/Footer'
import CustomChatbot from '../components/bot.js' 
import { SessionProvider } from "next-auth/react"
import Chart from 'chart.js/auto';
import {NextUIProvider} from "@nextui-org/react";
import { LanguageProvider } from '../utilities/i18n';
import GlobalAutoTranslator from '../components/GlobalAutoTranslator';

export default function App({ Component, pageProps }: AppProps) {
  return(<>
    <SessionProvider session={pageProps.session}>
      <NextUIProvider>
        <LanguageProvider>
          <GlobalAutoTranslator />
          <Component {...pageProps} />
          <CustomChatbot />
          <Footer/>
        </LanguageProvider>
      </NextUIProvider>
    </SessionProvider>
  </>)
}
