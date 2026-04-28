import Head from "next/head";
import Image from "next/image";
import {Aboutuscard} from "../components/AboutUsCard";
import {teamData} from "../utilities/data";
import ContactForm from "../components/ContactForm";

import Navbar from "../components/Navbar";

export default function Aboutus() {
  return (
    <div>
      <Head>
        <title>Tech Thela AI</title>
        <meta name="description" content="perfect for vendors" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      {/* heading */}
      <div className="flex flex-col justify-center align-middle w-[92%] md:w-4/5 mx-auto pt-24 md:pt-32">
        
        <div className="flex flex-col lg:flex-row text-left gap-8 lg:gap-4">
          {/* left */}
          <div className="flex flex-col justify-center align-middle space-y-6 lg:space-y-8 w-full lg:w-[60%]">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black ">
          ABOUT
          <span className="text-green-500"> US</span>{" "}
        </h1>

            <p className="text-base md:text-lg lg:text-xl leading-relaxed">
              {" "}
              Tech Thela AI is aimed to solve the problems of the street vendors by becoming 
              a platform providing the ailment to all their daily problems.
            </p>
            <p className="text-base md:text-lg lg:text-xl leading-relaxed">
              {" "}
              Ranging from converting their hardwork into smartwork to providing
              the feel of being working in an organised way are some of the
              benefits at the part of vendors to use us. Customers on the other
              hand get the power of bargaining back in their hands with a sense
              of added security and community building.
            </p>
          </div>
          {/* right */}
          <div className="w-full lg:w-[40%]">
            <Image
              src={"/assets/about.gif"}
              width={500}
              height={500}
              className="w-full max-w-[480px] mx-auto"
              alt=""
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 mt-10">
  
  
  <Aboutuscard
  
  /> 
         
          
        </div>
      </div>
      <div className="pt-20">
        <ContactForm />
      </div>
      <div>

      </div>
    </div>
  );
}
