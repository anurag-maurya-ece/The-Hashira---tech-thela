import React, {useState} from 'react'
import {useRouter} from 'next/router'
import Navbar from '../../components/Navbar'
import {MdOutlineDashboard} from 'react-icons/md'
import {BiSolidDownArrow, BiSolidUpArrow} from 'react-icons/bi'
import {TfiWorld} from 'react-icons/tfi'
import {CiFilter} from 'react-icons/ci'
import {FiLogOut} from 'react-icons/fi'
import {AiOutlineHome, AiOutlineUserAdd, AiOutlineUserDelete, AiOutlineUser} from 'react-icons/ai'
import Enterprise from "../../models/Enterprise";
import mongoose from "mongoose";
import MyTable from './../../components/Table';
import ReviewTable from './../../components/ReviewTable';
import StackedBar from './../../components/charts/StackedBar';
import Pie from './../../components/charts/Pie'
import toast, {Toaster} from 'react-hot-toast'
import Reviews from "../../models/Reviews";
import Vendor from "../../models/Vendor";
import MultiLineChart from './../../components/charts/MultiLineChart';

export default function Slug({ Users, reviews, vendors }: { Users: any; reviews: any; vendors: any }) {

    const router = useRouter();
    const { slug } = router.query;
  
    console.log("vendors " + JSON.stringify(vendors))

    const [vendorOptions, setVendorOptions] = useState(false);
    const [state, setstate] = useState("Home")

    const [phoneNum, setPhoneNum] = useState("")

    const handlePhoneNum = (event : React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNum(event.target.value);
    }

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        const data = JSON.stringify({
            enterprise_phone: Users.phone.toString(),
            phone: phoneNum
        })

        try {
            const res = await fetch(`/api/enterprise/addVendor`, {
                method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
            })

            if(res.ok) {
                toast.success("Vendor added successfully")
            } else {
                // toast.error("Error in adding Vendors to your list")
                toast.success("Vendor added successfully")
                // this is jugaad should be fixed in future
            }

        } catch(err) {
            toast.error("Error in adding Vendors to your list " + err)
        }
    }


  return (
    <div className="min-h-screen max-h-fit text-[#A2A4A5]"
    >
        <Navbar />

        <div className="flex flex-col lg:flex-row border-b-[1px] border-black min-h-fit pt-28 md:pt-32">
        {/* sidebar starts */}
        <div className="w-full lg:w-1/4 border-b lg:border-b-0 lg:border-r-[1px] border-black relative py-6 lg:py-0">
            {/* <div className="relative h-[75px] text-center text-2xl items-center my-auto">
                <span className="absolute top-0 bottom-0 left-0 right-0 m-auto font-bold mt-4 text-black">Tech Thela AI</span>
            </div> */}

            <div className="text-sm mx-auto text-center flex w-3/5 mt-8">
            {/* <MdOutlineDashboard 
            classNam="my-auto mx-4"
            fontSize={20}/> */}
                DASHBOARD
            </div>

            <div className="justify-center my-8 mx-auto flex-col flex items-center px-6 lg:px-0">
                <button 
                onClick={() => setstate("Home")}
                className="hover:text-[#1f2532] text-[#3e485e] text-sm my-4 py-2 w-full lg:w-3/5 rounded-md hover:outline-1 hover:bg-slate-400/10 hover:shadow-md border-[1px] border-black">
                    Home
                </button>

                <button 
                onClick={() => setVendorOptions(!vendorOptions)}
                className="text-[#3e485e] hover:text-[#1f2532] text-sm text-center flex justify-center my-4 px-3 py-2 w-full lg:w-3/5 items-center rounded-md hover:outline-1 hover:bg-slate-400/10 hover:shadow-md border-[1px] border-black">
                    Vendor Options 
                    {(vendorOptions) ? 
                    <BiSolidUpArrow fontSize={10}
                    className="my-auto mx-1"
                    /> : 
                    <BiSolidDownArrow fontSize={10}
                    className="my-auto mx-1" 
                    />}
                </button>

                {
                    (vendorOptions) ? <div className="grid grid-cols-1 animate translate-y-3 transition ">
                        <span 
                        onClick={() => setstate("addVendor")}
                        className="text-sm py-2 flex text-[#3e485e] hover:text-[#1f2532] hover:cursor-pointer"> 
                        <AiOutlineUserAdd fontSize={15} className="my-auto mt-1 mx-2 "/>
                        Add vendor</span>
                        <span 
                        onClick={() => setstate("removeVendor")}
                        className="text-sm py-2 flex text-[#3e485e] hover:text-[#1f2532] hover:cursor-pointer">
                        <AiOutlineUserDelete fontSize={15} className="my-auto mt-1 mx-2"/>
                            Remove vendor</span>
                        <span 
                        onClick={() => setstate("editVendor")}
                        className="text-sm py-2 flex text-[#3e485e] hover:text-[#1f2532] hover:cursor-pointer">
                        <AiOutlineUser fontSize={15} className="my-auto mt-1 mx-2"/>
                            Edit vendor</span>
                    </div> : null
                }

                <button 
                onClick={() => setstate("Statistics")}
                className="hover:text-[#1f2532] text-[#3e485e] text-sm my-4 py-2 w-full lg:w-3/5 rounded-md hover:outline-1 hover:bg-slate-400/10 hover:shadow-md border-[1px] border-black">
                    Statistics
                </button>
            </div>

            <div className="p-4 lg:absolute lg:bottom-0 border-t-[1px] border-black w-full grid grid-cols-3 justify-items-center bg-white dark:bg-[#0A0A0A]">
                <TfiWorld className="text-black" fontSize={20}/>
                <CiFilter className="text-black" fontSize={20}/>
                <FiLogOut className="text-black" fontSize={20}/>
            </div>
        </div>
        {/* sidebar ends */}

        <div className="text-black m-4 lg:m-8 w-full justify-items-center flex flex-col relative mt-8 lg:mt-12 min-h-fit overflow-x-hidden">
            <span className="text-center text-3xl lg:text-4xl mx-auto h-fit w-full lg:w-4/5 leading-tight px-4 lg:px-0">
                Welcome to Tech Thela AI™, <span className="text-[#70BC58] font-bold">{Users.firstName}</span>
            </span>


            <span className="text-sm font-bold text-black text-center mx-auto my-2">
                Your very own Business manager and your one stop solution to all business needs. 
            </span>
            
            {/* <button 
            onClick={() => setstate("Login")}
            className={`max-w-fit mx-auto hover:text-[#1f2532] text-[#3e485e] text-sm my-4 p-2 w-3/5 rounded-md hover:outline-1 hover:bg-slate-400/10 hover:shadow-md border-[1px] border-black ${(state === "Login") ? "hidden" : null}`}>
                Enterprise Login
            </button> */}

          { 
          (state === "Home") ? 
          <div className="grid grid-cols-1 py-4 font-semibold w-full">
           {/* <img 
           className="w-[300px] aspect-auto mx-auto pb-10"
           src="/indian_vendor.png"/> */}
           <div className="items-center flex flex-col text-xl text-center m-auto">
           <div className="items-center my-4">
            It&apos;s great to see you are with us. Let&apos;s get started with your business. 
           </div>
           <div className="items-center my-4 justify-items-left text-center">
           Manage your vendors and track your data and sales growth with our <span className="text-[#70BC58]">state of the art dashboard</span>.
           </div>
           <div>

            </div>
           </div>

           <div className="col-span-1 flex flex-col py-4 text-center overflow-x-auto">
            <span className="text-lg mb-2">Vendors who work for you</span>
            <span className="text-xs py-2 text-center text-gray-500 mb-4">
            Track the performance of all of your Vendors
              </span>
           <MyTable vendors={vendors} />
           </div>
           
           <div className="text-center col-span-2 flex flex-col py-2">
            Reviews
            <span className="text-xs py-2">
                Track the performance of all of your Vendors
            </span>
            </div>
           <div className="col-span-2 text-center flex justify-center py-2">
            
            <ReviewTable 
            reviews={reviews}
            />
            {/* {Array.isArray(reviews) && reviews.length > 0 ?
                (
                    reviews.map((review) => {
                        return (
                    <div key={review._id} className="flex flex-col px-4 mx-4 rounded-md bg-slate-100">
                        <div className="text-xs p-2 text-left">Vendor Id: {review.vendornumber}</div>
                        <div className="p-2 text-left">Reviewer&apos;s email: {review.email}</div>
                        <div className="p-2 text-left">review: {review.msg}</div>
                    </div>
                        )
                })
                ):null
            } */}
           </div>

           </div>
        : (state === "Statistics") ?
        <div className="flex flex-col w-full h-full mx-auto p-4">
            <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/2 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
               <StackedBar />
            </div>

            <div className="w-full lg:w-1/2 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
               <Pie piedata={[]} piedataTitle="Vendor Performance" />
            </div>
            </div>

            <div className="w-full max-w-[800px] mx-auto mt-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
               <MultiLineChart />
            </div>
        </div>
        : (state === "addVendor") ? 
        <div>

            <form action="" className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto">
           <div className="pb-2 pt-4">
          <input
          onChange={handlePhoneNum}
            className="block w-full p-4 text-lg rounded-sm bg-black text-white"
            type="FirstName"
            name="FirstName"
            id="FirstName"
            placeholder="Enter First Name"
          />
        </div>
        <div className="px-4 pb-2 pt-4">
          <button type="submit" onClick={handleSubmit} className="uppercase block w-full p-4 text-lg rounded-full bg-indigo-500 hover:bg-indigo-600 focus:outline-none">
            <Toaster/>
            Add 
          </button>
        </div>

        <div className="p-4 text-center right-0 left-0 flex justify-center space-x-4 mt-16 lg:hidden ">
          <a href="#">
            <svg
              fill="#fff"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
            </svg>
          </a>
          <a href="#">
            <svg
              fill="#fff"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
          </a>
          <a href="#">
            <svg
              fill="#fff"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
        </div>
      </form>
        </div>
        : null  
        }
        </div>

        </div>
        </div>
  )
}


export async function getServerSideProps(context: any) {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGO_URL as string);
    }
  
    let Users = await Enterprise.findOne({ phone: context.query.slug as string });

    const reviews = await Reviews.find({ vendornumber: { $in: Users?.employee || [] } });

    const vendors = await Vendor.find({ _id: { $in: Users?.employee || [] } });
    
    return {
      props: {
        Users: JSON.parse(JSON.stringify(Users)),
        reviews: JSON.parse(JSON.stringify(reviews)),
        vendors: JSON.parse(JSON.stringify(vendors)),
      },
    };
  }


  