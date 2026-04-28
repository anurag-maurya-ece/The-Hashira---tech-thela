import PaymentScanner from '../components/PaymentScanner';
import Navbar from '../components/Navbar';

const Payment = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="pt-24 md:pt-32 max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-500">
          <PaymentScanner />
        </div>
        
        <div className="mt-8 text-center text-gray-400 text-xs uppercase tracking-widest font-bold">
          Secure Sandbox Demo • SIH 2024
        </div>
      </div>
    </div>
  )
}

export default Payment