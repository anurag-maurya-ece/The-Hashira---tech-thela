import React, { useState, useEffect, Fragment, useLayoutEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import CustomerSidebar from "../components/CustomerSidebar";
import Leaderboard from "../components/Leaderboard";
import Head from "next/head";
import NearbyVendors from "../components/NearbyVendors";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Listbox, Transition } from "@headlessui/react";
import Review from "./../components/Review";
import ConsumerPing from "../components/ConsumerPing";
import VendorRadar from "../components/VendorRadar";


const nearMe = [
  {
    Name: "Ramu",
    Distance: "2km",
  },
  {
    Name: "Somu",
    Distance: "7km",
  },
  {
    Name: "Vihari",
    Distance: "1.1km",
  },
  {
    Name: "Akash Jindal",
    Distance: "2.1km",
  },
];

const pincode = [
  { id: 1, pinCode: 110080, unavailable: false },
  { id: 2, pinCode: 110081, unavailable: false },
  { id: 3, pinCode: 110082, unavailable: false },
  { id: 4, pinCode: 110083, unavailable: true },
  { id: 5, pinCode: 110084, unavailable: false },
  { id: 5, pinCode: 110085, unavailable: false },
];
const Products = [
  { id: 1, day: "golgappe", unavailable: false },
  { id: 2, day: "Fruit", unavailable: false },
  { id: 3, day: "Vegetable", unavailable: false },
  { id: 4, day: "icecream", unavailable: true },
];


const eventData = [
  {id: 1, src: "/meditation.jpg", pinCode: 110080, name: "Serene Meditation", time: "Tuesday: 6 - 7", Instructor: "Ms. Neelam"},
  {id: 2, src: "/zumba.jpg", pinCode: 110081, name: "Pro Dance", time: "Tuesday: 6 - 7", Instructor: "Ms. Neelam"},
  {id: 3, src: "/zumba.jpg", pinCode: 110083, name: "Vibezz The Dance", time: "Tuesday: 6 - 7", Instructor: "Ms. Neelam"},
  {id: 1, src: "/yoga.jpg", pinCode: 110080, name: "Tranquill", time: "Tuesday: 6 - 7", Instructor: "Ms. Neelam"},
  {id: 2, src: "/meditation.jpg", pinCode: 110081, name: "Bodhik", time: "Tuesday: 6 - 7", Instructor: "Ms. Neelam"},
  {id: 3, src: "/zumba.jpg", pinCode: 110083, name: "The Crazies", time: "Tuesday: 6 - 7", Instructor: "Ms. Neelam"},
]

type Props = {};

const LocateProduct = (props: Props) => {
  const date = new Date();
  const showTime =
    date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  const [time, setTime] = useState(showTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(showTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [showTime]);

  const [selected, setSelected] = useState(pincode[0]);
  const [todayDay, setTodayDay] = useState(Products[0]);
  const [show, setshow] = useState("");

  // toggle to button
  const [toggle, setToggle] = useState(true);

  const [dataSet, setDataSet] = useState({
    pin: selected.pinCode,
    day: todayDay.id,
    time: parseInt(date.getHours() + "" + date.getMinutes()),
  });
  useEffect(() => {
    let dateN = new Date();

    setDataSet({
      pin: selected.pinCode,
      day: todayDay.id,
      time: parseInt(dateN.getHours() + "" + dateN.getMinutes()),
    });
    console.log(dataSet);
  }, [toggle]);

  function sendData() {
    setToggle(!toggle);
    console.log(dataSet);
  }

  return (
    <>
      <div className="flex flex-col w-full lg:w-[70vw]">
        <div className="flex flex-col lg:grid lg:grid-cols-5 px-3 sm:px-4 md:px-10 gap-4 sm:gap-6 md:gap-8 py-6 sm:py-8 md:py-10">
          <div className="col-span-2 flex flex-col gap-4 sm:gap-5 md:gap-6">
            <h1 className="text-2xl sm:text-3xl font-semibold">Search here</h1>

            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold pb-2 sm:pb-3">Enter Location</h2>
              <Listbox value={selected} onChange={setSelected}>
                <div className="relative mt-1 z-40">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-sm sm:text-base text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300">
                    <span className="block truncate">{selected.pinCode}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm sm:text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {pincode.map((person, personIdx) => (
                        <Listbox.Option
                          key={personIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-amber-100 text-amber-900"
                                : "text-gray-900"
                            }`
                          }
                          value={person}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {person.pinCode}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  <CheckIcon
                                    className="h-4 w-4 sm:h-5 sm:w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>

            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-semibold pb-2 sm:pb-3">Enter Product</h2>
              <Listbox value={todayDay} onChange={setTodayDay}>
                <div className="relative mt-1 z-30">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-sm sm:text-base text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300">
                    <span className="block truncate">{todayDay.day}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute mt-1 w-full overflow-auto rounded-md bg-white py-1 text-sm sm:text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {Products.map((person, personIdx) => (
                        <Listbox.Option
                          key={personIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-amber-100 text-amber-900"
                                : "text-gray-900"
                            }`
                          }
                          value={person}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  todayDay ? "font-medium" : "font-normal"
                                }`}
                              >
                                {person.day}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  <CheckIcon
                                    className="h-4 w-4 sm:h-5 sm:w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>

            <button
              onClick={() => {
                setshow("show");
              }}
              className="bg-[#fc6441] w-full sm:w-2/5 rounded-xl p-2 sm:p-3 text-sm sm:text-base text-white font-semibold shadow-lg hover:bg-[#e55a3a] transition-colors"
            >
              Search
            </button>
            {show === "show" ? (
              <div className="w-full space-y-2 sm:space-y-3">
                <div className="bg-white shadow-md p-3 sm:p-4 rounded-xl text-xs sm:text-sm md:text-base text-black border-[#fc6441] border flex justify-between items-center">
                  <h1 className="font-bold">Ramu</h1>
                  <p className="text-[#fc6441] font-bold">1 km</p>
                </div>
                <div className="bg-white shadow-md p-3 sm:p-4 rounded-xl text-xs sm:text-sm md:text-base text-black border-[#fc6441] border flex justify-between items-center">
                  <h1 className="font-bold">Prakash</h1>
                  <p className="text-[#fc6441] font-bold">2 km</p>
                </div>
                <div className="bg-white shadow-md p-3 sm:p-4 rounded-xl text-xs sm:text-sm md:text-base text-black border-[#fc6441] border flex justify-between items-center">
                  <h1 className="font-bold">Akash Jindal</h1>
                  <p className="text-[#fc6441] font-bold">0.5 km</p>
                </div>
              </div>
            ) : null}
          </div>
          <div className="col-span-3 w-full">
            <div>
              <iframe
                width="100%"
                height="300"
                className="sm:h-[400px] md:h-[500px] rounded-lg"
                src="https://maps.google.com/maps?width=100%25&amp;height=500&amp;hl=en&amp;q=Ambica%20VIhar,%20New%20Delhi+(Ambika%20Vihar)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              >
                <a href="https://www.maps.ie/distance-area-calculator.html">
                  distance maps
                </a>
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Customer = () => {
  const mypincode = [
    { id: 1, pinCode: 110080},
    { id: 2, pinCode: 110081 },
    { id: 3, pinCode: 110082 },
    { id: 4, pinCode: 110083 },
    { id: 5, pinCode: 110084 },
    { id: 5, pinCode: 110085 },
  ];
  const [selected, setSelected] = useState(mypincode[0]);
  const [component, setcomponent] = useState("");

  const router = useRouter();

  const vendor_id = router.query.id;
  return (
    <>
      <Head>
        <title>Tech Thela AI</title>
        <meta name="description" content="perfect for vendors" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative overflow-x-hidden bg-gray-50 min-h-screen">
        <Navbar />

        <div className="flex flex-col lg:flex-row pt-28 md:pt-32">
          <div className="flex flex-col md:flex-row w-full z-0">
            <CustomerSidebar component={setcomponent} />

            <div className="flex flex-col mx-auto">
              {component === "vendors near me" ? (
                <div className="text-[#fc6441] text-2xl md:text-4xl text-center mt-10 md:mt-20 w-full max-w-[500px] mx-auto font-extrabold px-4">
                  Vendors near you{" "}
                </div>
              ) : null}

              {component === "review" || component === "" ? (
                <div className="w-full max-w-7xl mx-auto">
                  <Review prop={vendor_id} />
                </div>
              ) : null}
              <div className="mx-auto flex flex-col justify-center gap-8 w-full px-4 md:px-14 mt-10">
                {component === "vendors near me" ? (
                  <div className="w-full space-y-8">
                    <VendorRadar />
                    <NearbyVendors />
                  </div>
                ) : null}

                {/* leaderboard codee  */}
                {component === "leaderboard" ? <Leaderboard /> : null}

                {/* Demand Ping Simulation - PREVIEW READY */}
                {component === "demand ping" ? (
                  <div className="col-span-2 w-full max-w-4xl mx-auto mt-10">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg shadow-sm">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-700 font-medium">
                            Hackathon Simulation Mode: Broadcasting demand to nearby vendors using simulated 5G mesh logic.
                          </p>
                        </div>
                      </div>
                    </div>
                    <ConsumerPing consumerId="mock-consumer-id-123" />
                  </div>
                ) : null}

                {/* leaderboard code endss here */}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-4 md:mx-14 my-12 bg-gradient-to-br from-indigo-50 to-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border-2 border-indigo-100 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32"></div>
          <p className="font-black text-2xl md:text-3xl text-indigo-900 mb-2">✨ AI Vendor Recommendations</p>
          <p className="text-indigo-600 font-bold mb-8">Personalized for you</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {[
              { name: "Organic Greens", type: "Vegetables", score: "98% Match", icon: "🥦" },
              { name: "Suresh's Selection", type: "Fruits", score: "94% Match", icon: "🍎" },
              { name: "Global Spices", type: "Exotic", score: "89% Match", icon: "🌶️" }
            ].map((rec, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl shadow-md border-b-4 border-indigo-200 hover:scale-105 transition-all">
                <span className="text-4xl mb-4 block">{rec.icon}</span>
                <h4 className="font-bold text-xl text-gray-800">{rec.name}</h4>
                <p className="text-gray-500 text-sm font-bold uppercase">{rec.type}</p>
                <div className="mt-4 bg-indigo-100 text-indigo-700 font-black px-3 py-1 rounded-full text-xs inline-block">
                  {rec.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Customer;
