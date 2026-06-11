import { useState } from "react";
import { customerSegments, trafficBehaviorData, globalHeatmapMatrix } from "../data";
import { Users, Heatmap, BarChart, Percent, Activity, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function CustomerView() {
  const [selectedCohort, setSelectedCohort] = useState<string>("Super-Whales");
  const [selectedHeatPoint, setSelectedHeatPoint] = useState<string | null>(null);

  const cohortDetails = customerSegments.find(s => s.name === selectedCohort) || customerSegments[0];

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#10b981] uppercase font-bold">
            Aether Demographics Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-white mt-1">
            Customer Intelligence
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-semibold flex items-center gap-2 text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> CLUSTERING MATRICES
          </div>
        </div>
      </div>

      {/* Cohorts grid display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {customerSegments.map((segment) => {
          const isSelected = segment.name === selectedCohort;
          
          return (
            <div
              key={segment.name}
              onClick={() => setSelectedCohort(segment.name)}
              className={`p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? "bg-white/15 border-white/20 shadow-2xl"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">{segment.name}</h4>
                  <span className="text-3xl font-black text-white mt-3 block tracking-tight">
                    {segment.count.toLocaleString()}
                  </span>
                </div>
                <Users className="h-5 w-5 text-slate-500" style={{ color: segment.color }} />
              </div>

              <div className="mt-4 flex justify-between items-center text-[10px] font-mono font-medium">
                <span className="text-slate-400">{segment.percentage}% of cohort</span>
                <span className={`flex items-center font-bold ${
                  segment.growth > 0 ? "text-emerald-400" : "text-rose-400"
                }`}>
                  {segment.growth > 0 ? "+" : ""}{segment.growth}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Global checkouts heatmap simulator */}
        <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative min-h-[350px] flex flex-col justify-between overflow-hidden backdrop-blur-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />

          <div className="mb-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-emerald-400" />
              Live Server Conversion Heatmap
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Live coordinate mappings reflecting concurrent checkouts and checkout completions on global clusters. Tap grids to drill down.
            </p>
          </div>

          {/* Interactive Visual grid system representing geographical points */}
          <div className="relative w-full h-[220px] bg-white/5 border border-white/10 rounded-[1.5rem] flex items-center justify-center p-4">
            <svg className="absolute inset-0 w-full h-full opacity-10" width="100%" height="100%">
              <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>

            {/* Pulsing hotspots */}
            {globalHeatmapMatrix.map((point) => {
              const isActive = selectedHeatPoint === point.region;
              
              return (
                <div
                  key={point.region}
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                  onClick={() => setSelectedHeatPoint(isActive ? null : point.region)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                >
                  {/* Ripple pulse ring */}
                  <span className="absolute inline-flex h-8 w-8 rounded-full bg-emerald-400/25 animate-ping opacity-60 transform -translate-x-1/4 -translate-y-1/4" />
                  
                  {/* Center Node */}
                  <div className={`h-5 w-5 rounded-full border border-white/20 flex items-center justify-center shadow-lg transition duration-200 relative z-10 ${
                    isActive ? "bg-[#6366f1] scale-125" : "bg-emerald-500 hover:scale-110"
                  }`}>
                    <span className="text-[9px] font-black text-white font-mono">{point.count}</span>
                  </div>

                  {/* Tooltip on grid hover/select */}
                  <div className={`absolute top-6 left-1/2 transform -translate-x-1/2 bg-[#050505]/95 border border-white/10 rounded-2xl p-3.5 shadow-2xl w-36 pointer-events-none transition-all duration-200 z-50 ${
                    isActive ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  }`}>
                    <h5 className="text-[9px] font-mono text-[#6366f1] uppercase font-bold leading-none">{point.region}</h5>
                    <p className="text-[10px] text-white font-semibold mt-1.5">{point.count} concurrent queries</p>
                    <span className="text-[8px] text-slate-400 leading-none mt-1 block">Velocity rating: High</span>
                  </div>
                </div>
              );
            })}

            <div className="absolute top-3 left-3 text-[9px] font-mono text-indigo-400 bg-[#050505]/80 p-1.5 px-3 rounded-full border border-white/10 uppercase font-semibold">
              GLOBAL SERVER CLUSTERS: ONLINE
            </div>
            {selectedHeatPoint && (
              <div className="absolute bottom-3 right-3 text-[9px] font-mono text-emerald-400 font-bold">
                Active node sync target: {selectedHeatPoint}
              </div>
            )}
          </div>
        </div>

        {/* Behavior conversion profile panel */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative h-full backdrop-blur-2xl">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Percent className="h-4 w-4 text-purple-400" />
              Cohorts Conversion Velocity
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Active profile conversion ratios and bounce velocities listed by segment.
            </p>
          </div>

          <div className="h-[200px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={trafficBehaviorData} margin={{ left: -25, right: 0, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.01)" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} label={{ value: 'Conversion %', angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: '9px', fontFamily: 'monospace' } }} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(5, 5, 5, 0.95)", borderColor: "rgba(255,255,255,0.1)", borderRadius: "16px", color: "#fff", fontSize: "11px", fontFamily: "monospace" }} />
                <Bar dataKey="conversion" name="Conversion Rate %" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 border-t border-white/10 pt-4 space-y-1">
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block font-bold">Cohort Action Playbook</span>
            <span className="text-xs font-bold text-white block mt-1">{cohortDetails.name} segment</span>
            <p className="text-xs text-slate-400 leading-relaxed mt-1">
              Standard operations directive: Deploy hyper-focused seasonal checkout incentives. This group displays a {cohortDetails.growth > 0 ? "healthy" : "slack"} {cohortDetails.growth}% velocity expansion. Focus on securing checkout cart abandonment margins.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
