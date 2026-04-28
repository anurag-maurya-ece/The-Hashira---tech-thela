import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import QRCode from "react-qr-code";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const plans = [
  { id: "daily", name: "Per Day Plan", amount: 10, label: "INR 10 / day" },
  { id: "monthly", name: "Monthly Plan", amount: 270, label: "INR 270 / month" },
  { id: "yearly", name: "Yearly Plan", amount: 3000, label: "INR 3000 / year" },
];

export default function VendorPlans() {
  const router = useRouter();
  const phone = router.query.phone || "vendor";
  const [selectedPlan, setSelectedPlan] = useState(plans[1]);
  const [paymentStarted, setPaymentStarted] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);
  const [saveError, setSaveError] = useState("");

  const paymentLink = useMemo(() => {
    // Demo UPI link: replace VPA with your production UPI ID.
    const upiId = "techthela@upi";
    const tn = `Vendor ${selectedPlan.name} - ${phone}`;
    return `upi://pay?pa=${upiId}&pn=Tech%20Thela%20AI&am=${selectedPlan.amount}&cu=INR&tn=${encodeURIComponent(tn)}`;
  }, [selectedPlan, phone]);

  const handleOpenPayment = () => {
    setPaymentStarted(true);
    setSaveError("");
    window.open(paymentLink, "_blank", "noopener,noreferrer");

    // Demo success feedback after opening payment app/link.
    setTimeout(async () => {
      try {
        setSavingPlan(true);
        const response = await fetch("/api/vendor/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone,
            planId: selectedPlan.id,
            planLabel: selectedPlan.name,
            amount: selectedPlan.amount,
          }),
        });

        if (!response.ok) {
          throw new Error("Could not save plan");
        }

        setPaymentSuccess(true);
      } catch (error) {
        setSaveError("Payment completed but plan save failed. Please retry once.");
      } finally {
        setSavingPlan(false);
      }
    }, 2500);
  };

  return (
    <>
      <Navbar />
      <section className="min-h-screen pt-28 pb-16 px-4 bg-[#161616] text-white">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Choose Your Vendor Plan</h1>
          <p className="text-gray-300 mb-8">Select a plan and pay using QR scan.</p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => {
                  setSelectedPlan(plan);
                  setPaymentStarted(false);
                  setPaymentSuccess(false);
                }}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  selectedPlan.id === plan.id
                    ? "border-green-400 bg-green-900/20"
                    : "border-white/10 bg-black/20 hover:border-green-600"
                }`}
              >
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className="text-green-300 mt-2 font-bold">{plan.label}</p>
              </button>
            ))}
          </div>

          <div className="bg-black/30 border border-white/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-2">Pay for {selectedPlan.name}</h2>
            <p className="text-gray-300 mb-5">Amount: INR {selectedPlan.amount}</p>

            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="bg-white p-4 rounded-xl">
                <QRCode value={paymentLink} size={180} />
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-300">1. Scan this QR from any UPI app.</p>
                <p className="text-sm text-gray-300">2. Payment link will open in your payment app.</p>
                <p className="text-sm text-gray-300">3. Complete payment and return here.</p>

                <button
                  onClick={handleOpenPayment}
                  className="px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 font-semibold"
                >
                  Pay Now
                </button>

                {paymentStarted && !paymentSuccess && (
                  <p className="text-yellow-300 text-sm">Payment link opened. Waiting for confirmation...</p>
                )}

                {savingPlan && (
                  <p className="text-blue-300 text-sm">Saving your plan...</p>
                )}

                {saveError && (
                  <p className="text-red-300 text-sm">{saveError}</p>
                )}

                {paymentSuccess && (
                  <div className="mt-2 rounded-lg bg-green-900/30 border border-green-500/40 p-3">
                    <p className="text-green-300 font-semibold">Payment Successful</p>
                    <p className="text-sm text-gray-200">Your {selectedPlan.name} has been activated.</p>
                    <button
                      className="mt-3 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
                      onClick={() => router.push(`/Vendor/${phone}`)}
                    >
                      Go to Vendor Dashboard
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
