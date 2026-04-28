import React, {useState} from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {MdOutlineDashboard} from 'react-icons/md'
import {BiSolidDownArrow, BiSolidUpArrow} from 'react-icons/bi'
import {TfiWorld} from 'react-icons/tfi'
import {CiFilter} from 'react-icons/ci'
import {FiLogOut} from 'react-icons/fi'
import {AiOutlineHome, AiOutlineUserAdd, AiOutlineUserDelete, AiOutlineUser} from 'react-icons/ai'
import toast, {Toaster} from 'react-hot-toast'
import {useRouter } from 'next/router'


const Enterprise = () => {

  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  }

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleFirstName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  }

  console.log(firstName + " " + phone + " " + password + " ")
  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log("hi");
    
 
    // Create the request body
    const requestBody = JSON.stringify({
    //  type: "vendor",
        firstName: firstName,
      phone: phone,
      password: password,
    });

    try {
      const response = await fetch(`/api/enterprise/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });

      if (response.ok) {
        console.log(response + " response")
        router.push(`/Enterprise/${phone}`);
    
        const data = await response.json();
        console.log(data);
        console.log(requestBody);
        toast.success('Login Successful')
     
      } else {

        console.log('Request failed with status:', response.status);
        toast.error('Login Failed - Invalid Credentials or maybe user does not exist')
      }
    } catch (error) {
      console.log('An error occurred:', error);
      toast.error('Login Failed: ' + error)
    }
  };

    const [vendorOptions, setVendorOptions] = useState(false);
    const [state, setstate] = useState("Home")

  return (
    <div className="min-h-screen max-h-content text-[#A2A4A5]"
    >
        <Navbar />

        <div className="flex flex-col md:flex-row border-b-[1px] border-black min-h-fit pt-28 md:pt-32">
        {/* sidebar starts */}
        <div className="w-full md:w-1/4 border-b md:border-b-0 md:border-r-[1px] border-black relative py-6 md:py-0">
            {/* <div className="relative h-[75px] text-center text-2xl items-center my-auto">
                <span className="absolute top-0 bottom-0 left-0 right-0 m-auto font-bold mt-4 text-black">Tech Thela AI</span>
            </div> */}

            <div className="text-sm mx-auto text-center flex w-3/5">
            {/* <MdOutlineDashboard 
            classNam="my-auto mx-4"
            fontSize={20}/> */}
                DASHBOARD
            </div>

            <div className="justify-center my-8 mx-auto flex-col flex items-center px-6 md:px-0">
                <button 
                onClick={()  => setstate("Home")}
                className="hover:text-[#1f2532] text-[#3e485e] text-sm my-4 py-2 w-full md:w-3/5 rounded-md hover:outline-1 hover:bg-slate-400/10 hover:shadow-md border-[1px] border-black">
                    Home
                </button>

                <button 
                onClick={() => setVendorOptions(!vendorOptions)}
                className="text-[#3e485e] hover:text-[#1f2532] text-sm text-center flex justify-center my-4 px-3 py-2 w-full md:w-3/5 items-center rounded-md hover:outline-1 hover:bg-slate-400/10 hover:shadow-md border-[1px] border-black">
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
                        <span className="hover:cursor-not-allowed text-sm py-2 flex text-[#3e485e] hover:text-[#1f2532]"> 
                        <AiOutlineUserAdd fontSize={15} className="my-auto mt-1 mx-2 "/>
                        Add vendor</span>
                        <span className="hover:cursor-not-allowed text-sm py-2 flex text-[#3e485e] hover:text-[#1f2532]">
                        <AiOutlineUserDelete fontSize={15} className="my-auto mt-1 mx-2"/>
                            Remove vendor</span>
                        <span className="hover:cursor-not-allowed text-sm py-2 flex text-[#3e485e] hover:text-[#1f2532]">
                        <AiOutlineUser fontSize={15} className="my-auto mt-1 mx-2"/>
                            Edit vendor</span>
                    </div> : null
                }

                <button className="hover:text-[#1f2532] text-[#3e485e] text-sm my-4 py-2 w-full md:w-3/5 rounded-md hover:outline-1 hover:cursor-not-allowed hover:bg-slate-400/10 hover:shadow-md border-[1px] border-black">
                    Statistics
                </button>
            </div>

            <div className="p-4 md:absolute md:bottom-0 border-t-[1px] border-black w-full grid grid-cols-3 justify-items-center bg-white dark:bg-[#0A0A0A]">
                <TfiWorld className="text-black" fontSize={20}/>
                <CiFilter className="text-black" fontSize={20}/>
                <FiLogOut className="text-black" fontSize={20}/>
            </div>
        </div>
        {/* sidebar ends */}

        <div className="text-black m-4 md:m-8 w-full justify-items-center flex flex-col relative mt-8 md:mt-12 min-h-fit">
            <span className="text-center text-3xl md:text-4xl mx-auto h-fit w-full md:w-4/5 leading-tight px-4 md:px-0">
                Join with us and take your enterprise to new level!
            </span>

            <span className="text-sm font-bold text-black text-center mx-auto my-2">
                Trusted by vendors and Homemakers alike, are you ready to take your business to the next level?
            </span>
            
            <button 
            onClick={() => setstate("Login")}
            className={`max-w-fit mx-auto hover:text-[#1f2532] text-[#3e485e] text-sm my-6 p-3 px-6 rounded-md hover:outline-1 hover:bg-slate-400/10 hover:shadow-md border-[1px] border-black ${(state === "Login") ? "hidden" : null}`}>
                Enterprise Login
            </button>

          { 
          (state === "Home") ? 
           <img 
           className="w-[450px] aspect-auto mx-auto pb-10"
           src="https://cdn.shopify.com/shopifycloud/brochure/assets/landers/ppc/ecommerce/hero-large-ae50b5b2773d8c345a5b0b785bb4f5bd0590aebdccc5d3c0d1e39eaa7c932a52.png?quality=50"/>
        
        : (state === "Login") ? 
        <form action="" className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto">
           <div className="pb-2 pt-4">
          <input
          onChange={handleFirstName}
            className="block w-full p-4 text-lg rounded-sm bg-black text-white"
            type="FirstName"
            name="FirstName"
            id="FirstName"
            placeholder="Enter First Name"
          />
        </div>
        <div className="pb-2 pt-4">
          <input 
          onChange={handlePhoneChange}
            type="tel"
            name="phone"
            id="phone"
            placeholder="Phone Number"
            className="block w-full p-4 text-lg rounded-sm bg-black text-white"
          />
        </div>
        <div className="pb-2 pt-4">
          <input
          onChange={handlePasswordChange}
            className="block w-full p-4 text-lg rounded-sm bg-black text-white"
            type="password"
            name="password"
            id="password"
            placeholder="Enter Password"
          />
        </div>
        <div className="text-right text-gray-400 hover:underline hover:text-gray-100">
          <a href="#">Forgot Password?</a>
        </div>
        <div className="px-4 pb-2 pt-4">
          <button type="submit" onClick={handleSubmit} className="uppercase block w-full p-4 text-lg rounded-full bg-indigo-500 hover:bg-indigo-600 focus:outline-none">
            <Toaster/>
            sign in
          </button>
        </div>

        {/* <div className="py-6 space-x-2">
      <p className="text-gray-100 mb-5 ">Click below to sign in using your Gmail account</p>
        <button type="button" onClick={() => signIn("google" ,{callbackUrl: '/' })}>
        <span className="w-24 h-24 items-center justify-center inline-flex rounded-full font-bold text-lg border-2 border-white">
          G+
        </span>
        </button>
       
      
      </div> */}

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
        
        : null  
        }
        </div>

        </div>
        <Footer />
        </div>
  )
}

export default Enterprise