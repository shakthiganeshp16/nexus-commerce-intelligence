import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Trend, initialKPIs, revenueChartData } from "../data";
import { MetricCard } from "../types";
import InteractiveGlobe from "./InteractiveGlobe";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Zap, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

interface DashboardViewProps {
  onNavigate: (page: string) => void;
  systemMetrics: MetricCard[];
}

export default function DashboardView({ onNavigate, systemMetrics }: DashboardViewProps) {
  const [pulseMetric, setPulseMetric] = useState<number>(0);

  // Simulation effect to show "Real-time Metrics" fluctuating
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseMetric((prev) => (prev + 1) % 100);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner with smart status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-white">
            Executive Command
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time visual telemetry and predictive operations modeling.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-semibold flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> LIVE PIPELINE
          </div>
        </div>
      </div>

      {/* Bento KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {systemMetrics.map((kpi, index) => {
          const isUp = kpi.trend === "up";
          
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="relative p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:border-white/20 hover:shadow-2xl transition-all duration-300 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 blur-xl group-hover:scale-150 transition-all duration-500 rounded-full" />
              
              <div className="flex justify-between items-start relative z-10">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">
                  {kpi.title}
                </span>
                <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  isUp ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                }`}>
                  {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {isUp ? "+" : ""}{kpi.change}%
                </span>
              </div>

              <div className="mt-4 relative z-10 flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-white tracking-tight">
                  {kpi.value}
                </span>
                {kpi.title.includes("Active") && (
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse self-center ml-1" />
                )}
              </div>

              <div className="mt-4 text-[10px] font-mono text-slate-500 flex justify-between items-center relative z-10">
                <span>{kpi.timeframe}</span>
                <span className="text-indigo-400 group-hover:text-white transition-colors cursor-pointer" onClick={() => onNavigate("insights")}>
                  Analyze ↗
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Primary Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Sales Forecasting Chart Box */}
        <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex justify-between items-center sm:items-center mb-6 flex-col sm:flex-row gap-4 relative z-10">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                <TrendingUp className="h-4 w-4 text-indigo-400" />
                Revenue Analytics & Projections
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Real-time performance tracked against predictive artificial intelligence models.
              </p>
            </div>
            
            <div className="flex gap-2 text-[10px] font-semibold rounded-full bg-white/5 p-1 px-3 border border-white/10">
              <span className="flex items-center gap-1.5 py-0.5 rounded text-slate-300">
                <span className="h-2 w-2 rounded-full bg-indigo-500" /> Current GMV
              </span>
              <span className="flex items-center gap-1.5 py-0.5 rounded text-slate-300">
                <span className="h-2 w-2 rounded-full border border-indigo-400/40 border-dashed bg-transparent" /> Forecast Q2
              </span>
            </div>
          </div>

          <div className="h-[280px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "rgba(5, 5, 5, 0.95)", 
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    color: "#fff",
                    fontSize: "11px",
                    fontFamily: "monospace"
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#6366f1" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#actualGrad)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#a855f7" 
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  fillOpacity={1} 
                  fill="url(#forecastGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3D Interactive Logistics Map Globe */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-2xl flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5 uppercase tracking-wide">
                <Zap className="h-4 w-4 text-emerald-400" />
                Globe Telemetry Net
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ACTIVE
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Active coordinate nodes representing concurrent physical deliveries and routing mesh.
            </p>
          </div>

          <InteractiveGlobe />
        </div>
      </div>

      {/* Highlights Feed Bento Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:border-white/20">
          <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block mb-2">Operational Sync</span>
          <h4 className="text-white font-bold text-base">System Anomalies Mapped</h4>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Payment processing latency was noted in regional gateways (EMEA-Central) due to high load at 14:02 UTC. AI model automatically shifted routing pathways back to prime backup nodes.
          </p>
          <div className="mt-4 flex gap-2">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-400 font-semibold">
              Resolved
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300 cursor-pointer hover:bg-white/10" onClick={() => onNavigate("insights")}>
              View Log
            </span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:border-white/20">
          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block mb-2">Inventory Intelligence</span>
          <h4 className="text-white font-bold text-base">Re-order Triggers Generated</h4>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Predictive modeling projects Aether ANC Headphones stock will hit exhaustion markers in 9 days. System suggests a pre-emptive replenishment purchase of 150 units.
          </p>
          <div className="mt-4 flex gap-2">
            <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-mono text-purple-400 font-semibold font-bold">
              Trigger Raised
            </span>
            <span className="px-3 py-1 rounded-full bg-white text-black text-[10px] font-mono font-semibold cursor-pointer hover:bg-slate-200" onClick={() => onNavigate("products")}>
              Procure
            </span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] hover:border-pink-500/30">
          <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest block mb-2">Revenue Growth AI</span>
          <h4 className="text-white font-bold text-base">Bundle Strategy Available</h4>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Gemini recommended dynamic bundling pairing Aether Lamp with Spectra keyboards, based on mid-week checkout carts. Expected conversion velocity increase: 8%.
          </p>
          <div className="mt-4 flex gap-2">
            <span className="px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-[10px] font-mono text-pink-400 font-bold">
              AI Powered
            </span>
            <span className="px-3 py-1 rounded-full bg-pink-600 border border-pink-500/20 text-[10px] font-mono text-white cursor-pointer hover:bg-pink-500" onClick={() => onNavigate("insights")}>
              Synthesize ↗
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
