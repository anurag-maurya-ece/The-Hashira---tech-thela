import React, { useState, useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import toast from "react-hot-toast";

type Props = {
  vendorPhone?: string | number;
};

// Mapper for COCO-SSD labels to Vendor-friendly items
const ITEM_MAP: Record<string, { name: string; unit: string }> = {
  apple: { name: "Apple", unit: "kg" },
  orange: { name: "Orange", unit: "kg" },
  banana: { name: "Banana", unit: "dozen" },
  broccoli: { name: "Broccoli", unit: "kg" },
  carrot: { name: "Carrot", unit: "kg" },
  sandwich: { name: "Sandwich", unit: "piece" },
  cake: { name: "Cake", unit: "piece" },
  bottle: { name: "Bottle", unit: "piece" },
  potted_plant: { name: "Potted Plant", unit: "piece" },
};

const UpdateCart = ({ vendorPhone }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [isManual, setIsManual] = useState(false);
  const [manualForm, setManualForm] = useState({ item: "", quantity: "", unit: "kg", price: "" });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<cocoSsd.ObjectDetection | null>(null);

  // Load COCO-SSD model on mount
  useEffect(() => {
    async function loadModel() {
      try {
        await tf.ready();
        const model = await cocoSsd.load();
        modelRef.current = model;
        setModelLoading(false);
        console.log("TensorFlow Model Loaded");
      } catch (err) {
        console.error("Model Loading Error:", err);
        toast.error("AI Model failed to load. Please refresh.");
      }
    }
    loadModel();
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResults([]);
    }
  };

  const detectObjects = async (imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) => {
    if (!modelRef.current) return [];
    setLoading(true);
    const predictions = await modelRef.current.detect(imageElement);
    setLoading(false);

    // Filter and map predictions
    const detected = predictions
      .filter((p) => p.score > 0.5)
      .map((p) => {
        const mapped = ITEM_MAP[p.class.toLowerCase()] || { name: p.class, unit: "piece" };
        return {
          item: mapped.name,
          quantity: 1,
          unit: mapped.unit,
          confidence: Math.round(p.score * 100),
        };
      });

    return detected;
  };

  const handleUpload = async () => {
    if (!preview) return;
    
    const img = new Image();
    img.src = preview;
    img.onload = async () => {
      const detected = await detectObjects(img);
      if (detected.length === 0) {
        toast.error("No items detected. Try another photo.");
      } else {
        setResults(detected);
        toast.success(`Detected ${detected.length} items!`);
      }
    };
  };

  const saveToInventory = async () => {
    if (results.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch("/api/vendor/bulk-add-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: vendorPhone,
          items: results,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Inventory updated successfully!");
        setResults([]);
        setPreview(null);
        setFile(null);
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.item || !manualForm.quantity) return;

    setLoading(true);
    try {
      const res = await fetch("/api/vendor/add-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: vendorPhone,
          ...manualForm,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`${manualForm.item} added!`);
        setManualForm({ item: "", quantity: "", unit: "kg", price: "" });
      }
    } catch (err) {
      toast.error("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full lg:w-[70vw] min-h-[60vh] py-10 px-4">
      {/* AI Model Loading State */}
      {modelLoading && (
        <div className="mb-8 flex items-center gap-3 bg-emerald-50 px-6 py-3 rounded-full border border-emerald-100 animate-pulse">
          <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
          <span className="text-emerald-700 font-bold text-sm">Initializing AI Engine...</span>
        </div>
      )}

      <div className="rounded-[2.5rem] shadow-2xl bg-white dark:bg-gray-900 w-full max-w-2xl overflow-hidden border border-gray-100 dark:border-white/5 transition-all">
        {/* Header Style from hhh */}
        <div className="p-8 border-b border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
          <label className="block text-gray-800 dark:text-gray-100 text-3xl font-black tracking-tight">
            Update Cart <span className="text-emerald-500">Inventory</span>
          </label>
          <p className="text-gray-400 font-medium mt-1">Upload a photo to detect items using TensorFlow AI</p>
        </div>

        <div className="p-8">
          {/* Main Upload Area (hhh style) */}
          {!preview ? (
            <div className="flex items-center justify-center w-full h-80">
              <label className="flex flex-col w-full h-full border-4 border-dashed border-gray-200 dark:border-gray-800 rounded-[2rem] hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5 hover:border-emerald-300 transition-all cursor-pointer group">
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/10 rounded-3xl flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">
                    📸
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-600 dark:text-gray-300">Select cart photo</p>
                    <p className="text-sm text-gray-400 font-medium">PNG, JPG or JPEG up to 10MB</p>
                  </div>
                </div>
                <input type="file" className="hidden" onChange={handleFile} accept="image/*" />
              </label>
            </div>
          ) : (
            <div className="w-full space-y-6">
              <div className="relative rounded-[2rem] overflow-hidden shadow-xl border-4 border-white dark:border-gray-800 h-80">
                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                {loading && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="font-black text-xl tracking-wide">TENSORFLOW SCANNING...</p>
                  </div>
                )}
              </div>

              {results.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {results.map((res, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📦</span>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{res.item}</p>
                          <p className="text-xs text-emerald-500 font-black uppercase">Confidence: {res.confidence}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-lg text-emerald-600">{res.quantity} {res.unit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="flex gap-4">
                <button 
                  onClick={() => { setPreview(null); setResults([]); }}
                  className="flex-1 px-6 py-4 text-gray-500 font-bold bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                {results.length > 0 ? (
                  <button 
                    onClick={saveToInventory}
                    disabled={loading}
                    className="flex-[2] px-6 py-4 text-white bg-emerald-500 font-black text-lg rounded-2xl shadow-xl shadow-emerald-200 dark:shadow-none hover:translate-y-[-2px] active:scale-95 transition-all disabled:opacity-50"
                  >
                    Confirm & Save to Cart
                  </button>
                ) : (
                  <button 
                    onClick={handleUpload}
                    disabled={loading || modelLoading}
                    className="flex-[2] px-6 py-4 text-white bg-green-500 font-black text-lg rounded-2xl shadow-xl shadow-green-200 dark:shadow-none hover:translate-y-[-2px] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loading ? "Analyzing..." : "Start AI Detection"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Manual Toggle */}
        <div className="p-8 pt-0">
          <button 
            onClick={() => setIsManual(!isManual)}
            className="w-full py-4 text-sm font-black text-gray-400 uppercase tracking-widest border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl hover:text-emerald-500 hover:border-emerald-200 transition-all"
          >
            {isManual ? "Close Manual Entry" : "Or Add Item Manually"}
          </button>
          
          {isManual && (
            <form onSubmit={handleManualSubmit} className="mt-6 space-y-4 animate-in slide-in-from-top duration-300">
               <div className="grid grid-cols-2 gap-4">
                 <input 
                   placeholder="Product Name"
                   className="col-span-2 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                   value={manualForm.item}
                   onChange={(e) => setManualForm({...manualForm, item: e.target.value})}
                 />
                 <input 
                   placeholder="Qty"
                   type="number"
                   className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                   value={manualForm.quantity}
                   onChange={(e) => setManualForm({...manualForm, quantity: e.target.value})}
                 />
                 <select 
                   className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 font-bold"
                   value={manualForm.unit}
                   onChange={(e) => setManualForm({...manualForm, unit: e.target.value})}
                 >
                   <option value="kg">kg</option>
                   <option value="piece">piece</option>
                   <option value="dozen">dozen</option>
                 </select>
               </div>
               <button type="submit" className="w-full bg-slate-800 dark:bg-white dark:text-gray-900 text-white py-4 rounded-xl font-black text-lg">
                 Add Manual Item
               </button>
            </form>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default UpdateCart;
