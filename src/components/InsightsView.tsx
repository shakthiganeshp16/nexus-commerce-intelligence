import { useState, useEffect } from "react";
import { AIInsightRecommendation, AIForecast, Product } from "../types";
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, RefreshCw, Cpu } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { revenueChartData } from "../data";
import { motion } from "motion/react";

interface InsightsViewProps {
  products: Product[];
}

export default function InsightsView({ products }: InsightsViewProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>("Active monitoring indicates strong Q2 alignment. High potential for cross-selling expansion and inventory optimization identified in Tech and Apparel verticals.");
  const [recommendations, setRecommendations] = useState<AIInsightRecommendation[]>([
    {
      id: "rec-01",
      type: "inventory",
      title: "Overstock Risk Mitigation: Chronos Smartwatch V2",
      priority: "high",
      observation: "Chronos V2 shows a 14% inventory build-up velocity outpacing linear demand vectors over 14 days.",
      actionItem: "Deploy custom bundles pairing V2 with low-velocity accessories (e.g., Titanium straps) at a structured 15% incentive tier.",
      potentialImpact: "Uplift sell-through by 22% and secure cash conversion cycle liquidity."
    },
    {
      id: "rec-02",
      type: "revenue",
      title: "Value Capture optimization: Neo-Leather Jackets",
      priority: "medium",
      observation: "Apparel premium segment shows high conversion rates (>3.8%) with low price elasticity on mid-week traffic.",
      actionItem: "Implement smart dynamic surge adjustment of 4.5% during Wednesday peak hours combined with personal flash-prompts.",
      potentialImpact: "Increase gross merchandise value (GMV) by $12,400 with neutral retention impact."
    },
    {
      id: "rec-03",
      type: "marketing",
      title: "Re-engagement Push for Cart Abandoners",
      priority: "high",
      observation: "Customer Checkout Step 2 drops represent 34% of unrealized pipeline, mostly attributed to regional sales tax queries.",
      actionItem: "Trigger custom contextual message displaying free premium standard shipping threshold reminders.",
      potentialImpact: "Recover $45k in lost monthly opportunities based on current pipeline volume."
    }
  ]);
  const [forecast, setForecast] = useState<AIForecast>({
    nextMonthTarget: 843200,
    growthDriver: "Tactical bundle deployment & localized pricing modules",
    confidenceMetric: 94
  });

  const fetchAIInsights = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentMetrics: { products } }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.overallSummary) {
          setSummary(data.overallSummary);
          setRecommendations(data.recommendations || []);
          setForecast(data.forecast || { nextMonthTarget: 843200, growthDriver: "Core operations matrix", confidenceMetric: 90 });
        }
      }
    } catch (e) {
      console.error("Failed to query AI Insights endpoint. Using high-fidelity baseline data.", e);
    } finally {
      // Simulate slight processing timeline so animations look breathtaking
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* View Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/5 blur-[80px] rounded-full pointer-events-none" />
        <div>
          <span className="text-[10px] font-mono tracking-widest text-pink-400 uppercase font-bold">
            Aether Cognitive Core
          </span>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-white mt-1">
            AI Insights Hub
          </h1>
        </div>

        <button
          onClick={fetchAIInsights}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs tracking-tight transition duration-200 shadow-md cursor-pointer hover:bg-slate-200 disabled:bg-slate-800 disabled:text-slate-500"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Synthesizing Node..." : "Query Gemini Insights"}
        </button>
      </div>

      {loading ? (
        /* Shimmer Loading State with premium startup loading indicators */
        <div className="p-12 text-center bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center space-y-6 min-h-[350px] backdrop-blur-2xl">
          <div className="relative">
            <Cpu className="h-10 w-10 text-indigo-400 animate-pulse relative z-10" />
            <span className="absolute inset-0 h-10 w-10 bg-indigo-500/20 rounded-full blur animate-ping" />
          </div>
          <div>
            <span className="text-sm font-semibold tracking-wide text-white block">Invoking Cognitive Core Systems...</span>
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest mt-2 block animate-pulse font-bold">
              Recalculating enterprise vectors & sales trend models
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* AI recommendations log list */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Overall summary box */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] relative overflow-hidden backdrop-blur-2xl shadow-xl">
              <span className="absolute top-0 right-0 py-1.5 px-4 rounded-bl-[1.5rem] bg-pink-500/15 text-[9px] font-mono text-pink-400 uppercase tracking-wider font-bold border-l border-b border-white/5">
                Strategic Summary Note
              </span>
              <h3 className="text-white font-bold text-sm flex items-center gap-1.5">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Operational Assessment Summary
              </h3>
              <p className="text-xs text-slate-300 mt-4 leading-relaxed font-medium">
                {summary}
              </p>
            </div>

            {/* Core listed recommendations */}
            <div className="space-y-4">
              {recommendations.map((rec) => {
                const priorityColor = rec.priority === "high" ? "text-rose-400 bg-rose-500/10 border-rose-500/10" : "text-amber-400 bg-amber-500/10 border-amber-500/10";
                
                return (
                  <div
                    key={rec.id}
                    className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row gap-6 justify-between backdrop-blur-2xl shadow-lg"
                  >
                    <div className="space-y-3.5 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-tight border font-bold ${priorityColor}`}>
                          {rec.priority} Priority
                        </span>
                        <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold">{rec.type} vector</span>
                      </div>

                      <h4 className="text-white font-bold text-sm leading-tight">{rec.title}</h4>
                      <p className="text-xs text-slate-400 mt-1leading-relaxed">
                        <strong className="text-indigo-300">Observation:</strong> {rec.observation}
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        <strong className="text-[#10b981]">Tactical Action:</strong> {rec.actionItem}
                      </p>
                    </div>

                    <div className="bg-[#050505]/40 border-t md:border-t-0 md:border-l border-white/10 p-5 rounded-2xl md:rounded-r-2xl md:rounded-l-none flex flex-col justify-center min-w-[200px] text-right md:-my-6 md:-mr-6">
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Expected Velocity Lift</span>
                      <span className="text-xs font-bold text-white block mt-1.5 leading-normal">{rec.potentialImpact}</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Forecast analytics and Anomaly trackers */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Forecast bento card */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/15 blur-3xl rounded-full" />
              
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-indigo-400" />
                30-Day predictive telemetry
              </h3>

              <div className="space-y-6 mt-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">GMV Target</span>
                  <span className="text-3xl font-black text-white tracking-tight mt-1 ml-[-2px] block">
                    ${forecast.nextMonthTarget.toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Projected Growth driver</span>
                  <span className="text-xs text-slate-300 mt-1.5 block leading-relaxed font-bold">
                    {forecast.growthDriver}
                  </span>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between items-center text-[10px] font-mono mb-1.5">
                    <span className="text-slate-400 font-semibold">Confidence Metric</span>
                    <span className="text-indigo-400 font-bold">{forecast.confidenceMetric}% accurate</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 border border-white/10 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full"
                      style={{ width: `${forecast.confidenceMetric}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Anomaly check tracker */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-2xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-rose-400" />
                System Anomaly Check
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-rose-400">Payment Drop API Outage</span>
                    <span className="text-[10px] font-mono bg-rose-500/20 px-2 py-0.5 rounded-full text-rose-400 uppercase font-bold">March</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    Server outage and checkout timeouts registered in EMEA database gateway during peak promo window. Mitigated in 18 mins.
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span className="font-bold text-white">No-Response Cart Spikes</span>
                    <span className="text-[10px] font-mono bg-slate-850 px-2 py-0.5 rounded-full text-slate-400 uppercase font-bold">May</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    Checkout funnel cart velocity rose 220% on Wednesday traffic with flat checkouts. Diagnostic: tax-calculation API latency. Resolved.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
