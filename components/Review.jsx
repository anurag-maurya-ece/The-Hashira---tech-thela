import React, { useState, useEffect } from 'react';
import QrReader from 'react-qr-scanner';



const Review = (props) => {
  const [email, setemail] = useState('');
  const [name, setname] = useState('');
  const [number, setnumber] = useState('');
  const [msg, setmsg] = useState('');
  const [scanning, setScanning] = useState(false);
  const [qrCodeResult, setQrCodeResult] = useState('');



  useEffect(()=> {
    setnumber(props.prop);
  }, [number, props.prop])

  async function handleSubmit(e) {
    e.preventDefault();

    const data = 
      {
        name : name,
        vendornumber: number,
        msg: msg,
        email: email,
      };

    try {
        const response = await fetch(`/api/reviews`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          console.log("API call successful!");
          // You can do further processing here if needed
        } else {
          console.log("API call failed.");
          // Handle error cases here
        }
      } catch (error) {
        console.error("An error occurred:", error);
        // Handle network or other errors here
      }

    setemail('');
    setnumber('');
    setmsg('');
    setname('');
  }

  const handleScan = (data) => {
    if (data) {
      setQrCodeResult(data);
      setScanning(false);
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  const handleScanQRCode = () => {
    setScanning(true);
  };

  console.log(email + " emial")
  console.log(props.prop + " number")
  console.log(msg + " msg")

  return (
    <div className="w-full px-4 py-8">
      <form className="shadow-lg p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 w-full max-w-2xl mx-auto mt-8 sm:mt-20 bg-white rounded-lg">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#fc6441] font-bold text-center">
          Hey there, What is your review for Ravi Kumar?
        </h2>

       
        <div className="flex justify-center">
        <button
          className="bg-[#fc6441] hover:bg-[#fb5530] w-full sm:w-2/3 md:w-1/2 rounded-xl p-2 sm:p-3 text-white font-semibold text-sm sm:text-base transition-colors"
          onClick={handleScanQRCode}
        >
          Scan QR Code
        </button>
        </div>

        {scanning && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: '100%', maxWidth: '500px' }}
            />
          </div>
        )}

        {scanning && (
          <div className="flex items-center justify-center">
            <p className="text-2xl text-green-500 mb-4">
              QR code scanned successfully!
            </p>
            <p className="text-xl">{qrCodeResult}</p>
          </div>
        )}
 <p className="text-base sm:text-lg text-gray-500 text-center font-medium">OR</p>
 <input
          className="text-sm sm:text-base font-semibold pb-2 p-3 sm:p-4 shadow-sm shadow-gray-400 text-gray-400 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fc6441] transition"
          placeholder="Enter Vendor Number"
          value={props.prop}
          readOnly
          onChange={(e) => {
            setnumber(props.prop);
          }}
        />
        <input
          className="text-sm sm:text-base font-semibold pb-2 p-3 sm:p-4 shadow-sm shadow-gray-400 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fc6441] transition"
          placeholder="Your Name"
          value={name}
          onChange={(e) => {
            setname(e.target.value);
          }}
        />

        <input
          className="text-sm sm:text-base font-semibold pb-2 p-3 sm:p-4 shadow-sm shadow-gray-400 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fc6441] transition"
          placeholder="Your Email"
          type="email"
          value={email}
          onChange={(e) => {
            setemail(e.target.value);
          }}
        />
        

        <textarea
          className="text-sm sm:text-base font-semibold pb-2 p-3 sm:p-4 shadow-sm shadow-gray-400 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fc6441] transition resize-none min-h-[100px]"
          placeholder="Your Review"
          value={msg}
          onChange={(e) => {
            setmsg(e.target.value);
          }}
        />
         <div className="flex justify-center pt-2">
        <button
          onClick={(e) => handleSubmit(e)}
          className="bg-[#fc6441] hover:bg-[#fb5530] w-full sm:w-2/3 md:w-1/2 rounded-xl p-2 sm:p-3 text-white font-semibold text-sm sm:text-base transition-colors"
        >
          Submit Review
        </button>
        </div>     
      </form>
    </div>
  );
};

export default Review;
