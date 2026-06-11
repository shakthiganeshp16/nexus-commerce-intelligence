import { useState, useEffect } from "react";
import { Product, Order, MetricCard } from "./types";
import { initialProducts, initialKPIs, initialOrders } from "./data";

// Sub-components
import ParticleBackground from "./components/ParticleBackground";
import DashboardView from "./components/DashboardView";
import ProductView from "./components/ProductView";
import CustomerView from "./components/CustomerView";
import OrderView from "./components/OrderView";
import InsightsView from "./components/InsightsView";
import SettingsView from "./components/SettingsView";

// Icons
import { LayoutDashboard, Box, Users, Truck, Sparkles, Settings, Terminal, ShieldAlert } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // React state stores mirroring simulated data updates
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("aether_skus");
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("aether_orders");
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [systemKPIs, setSystemKPIs] = useState<MetricCard[]>(initialKPIs);
  const [telemetryRate, setTelemetryRate] = useState<number>(4);

  // Auto-save changes to localStorage to maintain full local persistence
  useEffect(() => {
    localStorage.setItem("aether_skus", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("aether_orders", JSON.stringify(orders));
  }, [orders]);

  // Recalculate KPI aggregates based on products state
  useEffect(() => {
    const totalRevenueSum = orders
      .filter((o) => o.status === "delivered" || o.status === "shipped" || o.status === "processing")
      .reduce((acc, o) => acc + o.amount, 1150); // add seed base

    const currentGMVFormatted = `$${(717000 + totalRevenueSum).toLocaleString()}`;
    const activeOrdersCount = orders.filter((o) => o.status !== "delivered").length;

    setSystemKPIs((prev) =>
      prev.map((k) => {
        if (k.title.includes("Gross")) {
          return { ...k, value: currentGMVFormatted };
        }
        if (k.title.includes("Active Orders")) {
          return { ...k, value: activeOrdersCount.toString() };
        }
        return k;
      })
    );
  }, [orders, products]);

  // Small dynamic simulation loop: slightly fluctuate conversion velocities & order counts for realistic metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemKPIs((prev) =>
        prev.map((kpi) => {
          if (kpi.title.includes("Conversion Velocity")) {
            const currentFloat = parseFloat(kpi.value);
            const fluctuation = (Math.random() - 0.5) * 0.12;
            const newVal = Math.max(1.8, Math.min(5.2, currentFloat + fluctuation)).toFixed(2) + "%";
            return {
              ...kpi,
              value: newVal,
              change: parseFloat(((fluctuation > 0 ? 1 : -1) * Math.random() * 2).toFixed(1)),
            };
          }
          return kpi;
        })
      );
    }, telemetryRate * 1000);

    return () => clearInterval(interval);
  }, [telemetryRate]);

  // SKUs manipulation handlers
  const handleAddProduct = (newP: Omit<Product, "id">) => {
    const nSku: Product = {
      ...newP,
      id: `prod-${products.length + 1}`,
      sales: 0,
    };
    setProducts((prev) => [...prev, nSku]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Orders supply chain dispatch progressors
  const handleUpdateOrderStatus = (id: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  // Reset database arrays
  const handleResetAllData = () => {
    localStorage.removeItem("aether_skus");
    localStorage.removeItem("aether_orders");
    setProducts(initialProducts);
    setOrders(initialOrders);
    setSystemKPIs(initialKPIs);
  };

  // Navigation controller helper
  const navigateToTab = (tab: string) => {
    setActiveTab(tab);
    // Subtle physical browser tick sound proxy if audio is toggled
  };

  return (
    <div className="relative min-h-screen text-slate-300 flex flex-col font-sans select-none pb-24 sm:pb-28 overflow-hidden">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Dynamic flowing atomic particle layer */}
      <ParticleBackground />

      {/* Top Main Navigation Header Bar */}
      <header className="sticky top-0 z-40 bg-white/5 border-b border-white/10 backdrop-blur-2xl px-4 sm:px-8 py-4 flex justify-between items-center">
        
        {/* Startup Trademark Identity branding */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateToTab("dashboard")}>
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-1.5 shadow-lg shadow-indigo-500/20">
            <span className="text-[11px] font-bold text-white tracking-widest font-mono">Æ</span>
          </div>
          <div>
            <span className="text-sm font-semibold tracking-tight text-white block">
              AETHER
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#6366f1] font-semibold leading-none uppercase max-sm:hidden block">
              Core VC telemetry
            </span>
          </div>
        </div>

        {/* Current server system state HUD */}
        <div className="flex items-center gap-3 font-mono text-[10px]">
          <div className="bg-white/5 px-4 py-2 border border-white/10 rounded-full text-xs font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE PIPELINE
          </div>
        </div>

      </header>

      {/* Primary Dashboard viewport wrapping appropriate pages */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 transition-all duration-300">
        
        {/* Nav tabs render routing swappers */}
        <div className="h-full">
          {activeTab === "dashboard" && (
            <DashboardView onNavigate={navigateToTab} systemMetrics={systemKPIs} />
          )}
          {activeTab === "products" && (
            <ProductView
              products={products}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}
          {activeTab === "customers" && <CustomerView />}
          {activeTab === "orders" && (
            <OrderView
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onResetOrders={() => setOrders(initialOrders)}
            />
          )}
          {activeTab === "insights" && <InsightsView products={products} />}
          {activeTab === "settings" && (
            <SettingsView
              telemetryRate={telemetryRate}
              onSetTelemetryRate={setTelemetryRate}
              onResetAllData={handleResetAllData}
            />
          )}
        </div>

      </main>

      {/* Apple-inspired Floating Navigation Shelf Dock */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-auto px-4 max-sm:w-[94%]">
        <nav className="flex items-center justify-center gap-1.5 sm:gap-2.5 p-2 bg-[#0a0a0f]/80 border border-white/15 rounded-full shadow-2xl backdrop-blur-2xl relative overflow-hidden">
          
          <button
            onClick={() => navigateToTab("dashboard")}
            className={`flex items-center gap-2 p-2.5 px-4 rounded-full text-xs font-semibold tracking-tight transition duration-300 cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-white/15 text-white border border-white/10 shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="max-sm:hidden">Executive</span>
          </button>

          <button
            onClick={() => navigateToTab("products")}
            className={`flex items-center gap-2 p-2.5 px-4 rounded-full text-xs font-semibold tracking-tight transition duration-300 cursor-pointer ${
              activeTab === "products"
                ? "bg-white/15 text-white border border-white/10 shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Box className="h-4 w-4" />
            <span className="max-sm:hidden">Products</span>
          </button>

          <button
            onClick={() => navigateToTab("customers")}
            className={`flex items-center gap-2 p-2.5 px-4 rounded-full text-xs font-semibold tracking-tight transition duration-300 cursor-pointer ${
              activeTab === "customers"
                ? "bg-white/15 text-white border border-white/10 shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="h-4 w-4" />
            <span className="max-sm:hidden">Customers</span>
          </button>

          <button
            onClick={() => navigateToTab("orders")}
            className={`flex items-center gap-2 p-2.5 px-4 rounded-full text-xs font-semibold tracking-tight transition duration-300 cursor-pointer ${
              activeTab === "orders"
                ? "bg-white/15 text-white border border-white/10 shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Truck className="h-4 w-4" />
            <span className="max-sm:hidden">Orders</span>
          </button>

          <button
            onClick={() => navigateToTab("insights")}
            className={`flex items-center gap-2 p-2.5 px-4 rounded-full text-xs font-semibold tracking-tight transition duration-300 cursor-pointer ${
              activeTab === "insights"
                ? "bg-pink-600/15 text-pink-400 border border-pink-500/15 shadow-lg"
                : "text-slate-400 hover:text-pink-400 hover:bg-white/5"
            }`}
          >
            <Sparkles className="h-4 w-4 text-pink-400 animate-pulse" />
            <span className="max-sm:hidden">AI Insights</span>
          </button>

          <button
            onClick={() => navigateToTab("settings")}
            className={`flex items-center gap-2 p-2.5 px-4 rounded-full text-xs font-semibold tracking-tight transition duration-300 cursor-pointer ${
              activeTab === "settings"
                ? "bg-white/15 text-white border border-white/10 shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Settings className="h-4 w-4" />
            <span className="max-sm:hidden">Settings</span>
          </button>

        </nav>
      </div>

    </div>
  );
}
