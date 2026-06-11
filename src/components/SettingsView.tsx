import { useState } from "react";
import { Sliders, Volume2, Database, ShieldAlert, Cpu, Network, CheckCircle } from "lucide-react";

interface SettingsViewProps {
  telemetryRate: number;
  onSetTelemetryRate: (rate: number) => void;
  onResetAllData: () => void;
}

export default function SettingsView({ telemetryRate, onSetTelemetryRate, onResetAllData }: SettingsViewProps) {
  const [globeLight, setGlobeLight] = useState<number>(4.0);
  const [hapticSound, setHapticSound] = useState<boolean>(true);
  const [securityShield, setSecurityShield] = useState<boolean>(true);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  const saveConfiguration = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Settings Banner */}
      <div className="bg-gradient-to-r from-slate-950/20 via-indigo-950/15 to-transparent p-6 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase">
            Aether Platform Config
          </span>
          <h1 className="text-2xl sm:text-3xl font-sans font-semibold tracking-tight text-white mt-1">
            System Settings
          </h1>
        </div>
        <button
          onClick={saveConfiguration}
          className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-mono rounded-xl font-semibold duration-200 cursor-pointer text-white"
        >
          Deploy Configurations
        </button>
      </div>

      {showNotification && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-xs font-mono text-emerald-400">
          <CheckCircle className="h-4 w-4" /> Global telemetry system parameters recompiled safely!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Column 1: Client Simulation settings */}
        <div className="bg-[#0b0b17]/60 border border-white/5 rounded-2xl p-5 shadow-lg space-y-5">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3">
            <Sliders className="h-4 w-4 text-indigo-400" />
            Operational Parameters
          </h3>

          <div className="space-y-4">
            
            {/* Slider for telemetry ping rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Holographic Telemetry Ping Rate</span>
                <span className="font-mono text-indigo-400">{telemetryRate} seconds</span>
              </div>
              <input
                type="range"
                min="2"
                max="12"
                value={telemetryRate}
                onChange={(e) => onSetTelemetryRate(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <span className="text-[9px] font-mono text-slate-500 block">Controls metrics fluctuation velocity on the executive dashboard.</span>
            </div>

            {/* Slider for 3D Globe light level */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">3D Shader Specular Light Intensity</span>
                <span className="font-mono text-indigo-400">{globeLight.toFixed(1)} lux</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={globeLight}
                onChange={(e) => setGlobeLight(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <span className="text-[9px] font-mono text-slate-500 block">Vary peak light exposure coefficients for 3D WebGL render states.</span>
            </div>

            {/* Toggles */}
            <div className="flex justify-between items-center py-2 border-t border-white/5 pt-4">
              <div>
                <span className="text-xs text-slate-300 font-medium block">Auditory Action Feedback</span>
                <span className="text-[9px] font-mono text-slate-500 mt-0.5 block">Trigger haptic/UI micro-ticks on clicking links.</span>
              </div>
              <button
                onClick={() => setHapticSound(!hapticSound)}
                className={`w-12 h-6 rounded-full transition-colors relative duration-200 cursor-pointer ${
                  hapticSound ? "bg-indigo-600" : "bg-slate-800"
                }`}
              >
                <span className={`absolute top-1 left-1 h-4 w-4 bg-white rounded-full transition-transform duration-200 ${
                  hapticSound ? "translate-x-6" : ""
                }`} />
              </button>
            </div>

            <div className="flex justify-between items-center py-2 border-t border-white/5 pt-4">
              <div>
                <span className="text-xs text-slate-300 font-medium block">Zero-Trust Pipeline Guard</span>
                <span className="text-[9px] font-mono text-slate-500 mt-0.5 block">Automatic payload encryption checks on orders.</span>
              </div>
              <button
                onClick={() => setSecurityShield(!securityShield)}
                className={`w-12 h-6 rounded-full transition-colors relative duration-200 cursor-pointer ${
                  securityShield ? "bg-indigo-600" : "bg-slate-800"
                }`}
              >
                <span className={`absolute top-1 left-1 h-4 w-4 bg-white rounded-full transition-transform duration-200 ${
                  securityShield ? "translate-x-6" : ""
                }`} />
              </button>
            </div>

          </div>
        </div>

        {/* Database & Diagnostics console printout */}
        <div className="space-y-6">
          
          {/* Diagnostic status values */}
          <div className="bg-[#0b0b17]/60 border border-white/5 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3">
              <Cpu className="h-4 w-4 text-emerald-400" />
              Platform Diagnostics telemetry
            </h3>

            <div className="space-y-2 font-mono text-[10px]">
              <div className="flex justify-between items-center p-2 rounded bg-slate-950/60 border border-white/5">
                <span className="text-slate-500">Node WebGL Engine</span>
                <span className="text-emerald-400 font-semibold uppercase">Three.js v134 Core Live</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-950/60 border border-white/5">
                <span className="text-slate-500">Framework Engine</span>
                <span className="text-indigo-400 font-semibold">Vite 6 + React 19 Client</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-950/60 border border-white/5">
                <span className="text-slate-500">Routing Mode IP ingress</span>
                <span className="text-slate-300">0.0.0.0:3000 (Cloud Run)</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-950/60 border border-white/5">
                <span className="text-slate-500">Server API Session Secure</span>
                <span className="text-emerald-400 font-semibold uppercase">Yes</span>
              </div>
            </div>
          </div>

          {/* Destructive state modifiers */}
          <div className="bg-[#0b0b17]/60 border border-white/5 rounded-2xl p-5 shadow-lg space-y-4 border-l-rose-500/20 border-l-4">
            <h2 className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-rose-400" />
              Platform Database modifiers
            </h2>
            <p className="text-[11px] text-slate-400 leading-normal">
              Resetting cache registers will clear any synthesized product lines, shipping workflow statuses, and dynamic forecasts.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  onResetAllData();
                  alert("Holographic cache database registries wiped and reset back to genesis profiles.");
                }}
                className="w-full py-2.5 rounded-xl border border-rose-500/10 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-mono text-xs cursor-pointer tracking-tight transition duration-200 text-center"
              >
                Clear Cache Databases
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
