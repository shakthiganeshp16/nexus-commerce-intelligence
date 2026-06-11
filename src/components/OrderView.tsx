import { useState, useEffect } from "react";
import { Order } from "../types";
import { Truck, CheckCircle2, RotateCcw, Compass, ArrowRight, Play, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";

interface OrderViewProps {
  orders: Order[];
  onUpdateOrderStatus: (id: string, newStatus: Order["status"]) => void;
  onResetOrders: () => void;
}

export default function OrderView({ orders, onUpdateOrderStatus, onResetOrders }: OrderViewProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || "");
  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const handleNextStatus = (id: string, currentStatus: Order["status"]) => {
    let next: Order["status"];
    switch (currentStatus) {
      case "pending":
        next = "processing";
        break;
      case "processing":
        next = "shipped";
        break;
      case "shipped":
        next = "delivered";
        break;
      case "delivered":
        return; // already complete
    }
    onUpdateOrderStatus(id, next);
  };

  return (
    <div className="space-y-6">
      
      {/* Tracker Headers */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#10b981] uppercase font-bold">
            Aether Dispatch Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-white mt-1">
            Orders Command Center
          </h1>
        </div>

        <button
          onClick={onResetOrders}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs tracking-tight transition duration-200 shadow-md cursor-pointer hover:bg-slate-200"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Logistics Simulator
        </button>
      </div>

      {/* Main assembly pipeline map */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Pipeline Column 1: Pending */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex flex-col justify-between min-h-[300px] backdrop-blur-2xl">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-semibold text-amber-500 uppercase flex items-center gap-1.5 font-bold tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                Pending Verification
              </span>
              <span className="text-[10px] font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full text-amber-400 border border-amber-500/20">
                {orders.filter((o) => o.status === "pending").length}
              </span>
            </div>

            <div className="space-y-3">
              {orders.filter((o) => o.status === "pending").map((o) => (
                <div
                  key={o.id}
                  onClick={() => setSelectedOrderId(o.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition duration-200 ${
                    selectedOrderId === o.id
                      ? "bg-white/10 border-white/30"
                      : "bg-[#050505]/40 border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-slate-500">{o.id}</span>
                    <span className="text-xs text-white font-bold">${o.amount}</span>
                  </div>
                  <h4 className="text-xs text-white mt-1.5 font-semibold leading-normal">{o.productName}</h4>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-[9px] font-mono text-slate-400">{o.region}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextStatus(o.id, o.status);
                      }}
                      className="p-1 px-2 rounded-full bg-amber-500 hover:bg-amber-400 transition-colors cursor-pointer text-slate-950 font-semibold text-[9px] flex items-center gap-0.5"
                    >
                      Process <Play className="h-2 w-2 fill-current ml-0.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pipeline Column 2: Processing */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex flex-col justify-between min-h-[300px] backdrop-blur-2xl">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-semibold text-blue-400 uppercase flex items-center gap-1.5 font-bold tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                Packaging / Allocation
              </span>
              <span className="text-[10px] font-bold bg-blue-500/10 px-2.5 py-0.5 rounded-full text-blue-400 border border-blue-500/20">
                {orders.filter((o) => o.status === "processing").length}
              </span>
            </div>

            <div className="space-y-3">
              {orders.filter((o) => o.status === "processing").map((o) => (
                <div
                  key={o.id}
                  onClick={() => setSelectedOrderId(o.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition duration-200 ${
                    selectedOrderId === o.id
                      ? "bg-white/10 border-white/30"
                      : "bg-[#050505]/40 border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-slate-500">{o.id}</span>
                    <span className="text-xs text-white font-bold">${o.amount}</span>
                  </div>
                  <h4 className="text-xs text-white mt-1.5 font-semibold leading-normal">{o.productName}</h4>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-[9px] font-mono text-slate-400">{o.region}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextStatus(o.id, o.status);
                      }}
                      className="p-1 px-2 rounded-full bg-blue-500 hover:bg-blue-400 transition-colors cursor-pointer text-white font-semibold text-[9px] flex items-center gap-0.5"
                    >
                      Ship <ArrowRight className="h-2 w-2 ml-0.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pipeline Column 3: Shipped */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex flex-col justify-between min-h-[300px] backdrop-blur-2xl">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-semibold text-indigo-400 uppercase flex items-center gap-1.5 font-bold tracking-wider">
                <Truck className="h-3.5 w-3.5 text-indigo-400" />
                Transit Carrier Hub
              </span>
              <span className="text-[10px] font-bold bg-indigo-500/10 px-2.5 py-0.5 rounded-full text-indigo-400 border border-indigo-500/20">
                {orders.filter((o) => o.status === "shipped").length}
              </span>
            </div>

            <div className="space-y-3">
              {orders.filter((o) => o.status === "shipped").map((o) => (
                <div
                  key={o.id}
                  onClick={() => setSelectedOrderId(o.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition duration-200 ${
                    selectedOrderId === o.id
                      ? "bg-white/10 border-white/30"
                      : "bg-[#050505]/40 border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-slate-500">{o.id}</span>
                    <span className="text-xs text-white font-bold">${o.amount}</span>
                  </div>
                  <h4 className="text-xs text-white mt-1.5 font-semibold leading-normal">{o.productName}</h4>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-[9px] font-mono text-slate-400">{o.region}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextStatus(o.id, o.status);
                      }}
                      className="p-1 px-2 rounded-full bg-indigo-500 hover:bg-indigo-400 transition-colors cursor-pointer text-white font-semibold text-[9px] flex items-center gap-0.5"
                    >
                      Complete <CheckCircle2 className="h-2.5 w-2.5 ml-0.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pipeline Column 4: Delivered */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex flex-col justify-between min-h-[300px] backdrop-blur-2xl">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-semibold text-emerald-400 uppercase flex items-center gap-1.5 font-bold tracking-wider">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Completed Delivery
              </span>
              <span className="text-[10px] font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full text-emerald-400 border border-emerald-500/20">
                {orders.filter((o) => o.status === "delivered").length}
              </span>
            </div>

            <div className="space-y-3">
              {orders.filter((o) => o.status === "delivered").map((o) => (
                <div
                  key={o.id}
                  onClick={() => setSelectedOrderId(o.id)}
                  className={`p-4 rounded-2xl border cursor-pointer opacity-70 transition duration-200 ${
                    selectedOrderId === o.id
                      ? "bg-white/10 border-white/30 opacity-100"
                      : "bg-[#050505]/40 border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-slate-500">{o.id}</span>
                    <span className="text-xs text-emerald-400 font-bold">${o.amount}</span>
                  </div>
                  <h4 className="text-xs text-white mt-1.5 font-semibold leading-normal">{o.productName}</h4>
                  <div className="mt-3 flex justify-between items-center text-[9px] font-mono text-slate-400">
                    <span>{o.region}</span>
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Archived</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Selected Order telemetry details */}
      {selectedOrder && (
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="flex items-center gap-4 relative z-10">
            <img
              src={selectedOrder.avatar}
              alt=""
              className="h-14 w-14 rounded-full ring-2 ring-indigo-500/30 object-cover shadow-lg"
            />
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">Target Consignee</span>
              <h3 className="text-base font-bold text-white mt-0.5">{selectedOrder.customerName}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-normal">
                LTV profile alignment: High • Regional routing: <span className="font-mono text-indigo-400 font-bold">{selectedOrder.region}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto font-mono text-xs relative z-10">
            <div className="bg-[#050505]/40 border border-white/10 rounded-2xl p-4 px-6 flex-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Invoice Yield</span>
              <span className="text-base font-black text-white mt-1 block">${selectedOrder.amount}</span>
            </div>

            <div className="bg-[#050505]/40 border border-white/10 rounded-2xl p-4 px-6 flex-1 md:w-48">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Logistics Stage</span>
              <span className="text-sm font-bold text-[#6366f1] mt-1.5 block uppercase">
                {selectedOrder.status}
              </span>
            </div>

            <button
              onClick={() => handleNextStatus(selectedOrder.id, selectedOrder.status)}
              disabled={selectedOrder.status === "delivered"}
              className={`p-4 px-6 rounded-full font-semibold transition cursor-pointer self-center text-xs whitespace-nowrap ${
                selectedOrder.status === "delivered"
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5"
                  : "bg-white text-black hover:bg-slate-200 shadow-xl"
              }`}
            >
              Dispatch Next Phase
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
