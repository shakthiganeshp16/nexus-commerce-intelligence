import { useState } from "react";
import { Product } from "../types";
import Product3DPreview from "./Product3DPreview";
import { Plus, Trash2, Box, Sparkles, Filter, Database, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface ProductViewProps {
  products: Product[];
  onAddProduct: (p: Omit<Product, "id">) => void;
  onDeleteProduct: (id: string) => void;
}

export default function ProductView({ products, onAddProduct, onDeleteProduct }: ProductViewProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || "");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  
  // Adding products form parameters
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Wearables");
  const [newPrice, setNewPrice] = useState<number>(199);
  const [newInventory, setNewInventory] = useState<number>(100);
  const [newShape, setNewShape] = useState<"sphere" | "torus" | "cube" | "knot">("knot");

  // Filtered products list
  const filteredProducts = products.filter(
    (p) => filterCategory === "All" || p.category === filterCategory
  );

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    onAddProduct({
      name: newName,
      category: newCategory,
      price: newPrice,
      inventory: newInventory,
      status: newInventory === 0 ? "out-of-stock" : newInventory < 30 ? "low-stock" : "in-stock",
      sales: 0,
      growth: Math.floor(Math.random() * 40),
      color: ["#6366f1", "#a855f7", "#ec4899", "#3b82f6", "#10b981"][Math.floor(Math.random() * 5)],
      threeDType: newShape
    });
    
    // reset form
    setNewName("");
    setNewPrice(199);
    setNewInventory(100);
    setShowAddForm(false);
  };

  // Click-to-Move simulation of "Drag-and-Drop inventory system"
  // Move item directly between Custom Pipeline Tiers: [Core Catalogue], [Trending Prime Promotion], [Liquidation / Clearance Bundle]
  const [promotionTiers, setPromotionTiers] = useState<Record<string, "core" | "trending" | "liquidation">>({
    "prod-1": "trending",
    "prod-2": "core",
    "prod-3": "core",
    "prod-4": "liquidation",
    "prod-5": "core"
  });

  const moveProductTier = (prodId: string, dest: "core" | "trending" | "liquidation") => {
    setPromotionTiers(prev => ({
      ...prev,
      [prodId]: dest
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#6366f1] uppercase font-bold">
            Aether Asset Forge
          </span>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-white mt-1">
            Product Logistics
          </h1>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs tracking-tight transition duration-200 shadow-md cursor-pointer hover:bg-slate-200"
        >
          <Plus className="h-4 w-4" />
          {showAddForm ? "Cancel Forge" : "Add Custom SKU"}
        </button>
      </div>

      {/* Add Custom SKU panel modal */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        >
          <form onSubmit={handleCreate} className="space-y-6">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              SKU Generation Vector
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 block uppercase font-semibold">Product Title</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Tesla Charger V3"
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 px-4 text-xs text-white outline-none focus:border-white/30"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 block uppercase font-semibold">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-full py-2.5 px-4 text-xs text-indigo-400 outline-none focus:border-white/30 cursor-pointer"
                >
                  <option value="Wearables">Wearables</option>
                  <option value="Audio">Audio</option>
                  <option value="Peripherals">Peripherals</option>
                  <option value="Power">Power</option>
                  <option value="Smart Home">Smart Home</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 block uppercase font-semibold">Retail (USD)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(parseInt(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 px-4 text-xs text-white outline-none focus:border-white/30"
                  min={1}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 block uppercase font-semibold">Initial Stock</label>
                <input
                  type="number"
                  value={newInventory}
                  onChange={(e) => setNewInventory(parseInt(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 px-4 text-xs text-white outline-none focus:border-white/30"
                  min={0}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 block uppercase font-semibold">3D Render shape</label>
                <select
                  value={newShape}
                  onChange={(e) => setNewShape(e.target.value as any)}
                  className="w-full bg-slate-900 border border-white/10 rounded-full py-2.5 px-4 text-xs text-indigo-400 outline-none focus:border-white/30 cursor-pointer"
                >
                  <option value="knot">Torus Knot</option>
                  <option value="torus">Torus Ring</option>
                  <option value="cube">Crystalline Cube</option>
                  <option value="sphere">Polygonal Sphere</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-white text-black font-semibold hover:bg-slate-200 px-6 py-2.5 text-xs rounded-full transition-all cursor-pointer"
              >
                Synthesize Mesh & SKU
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Main interactive grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Column 1: Products Catalogue table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 shadow-2xl backdrop-blur-2xl">
            
            {/* Filter toolbar */}
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Database className="h-4 w-4 text-purple-400" />
                Active SKUs ({filteredProducts.length})
              </h2>

              <div className="flex items-center gap-2 bg-slate-950/70 p-1.5 rounded-xl border border-white/5">
                <Filter className="h-3 w-3 text-slate-500 ml-1.5" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-transparent text-[10px] font-mono text-slate-400 outline-none pr-2 cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Wearables">Wearables</option>
                  <option value="Audio">Audio</option>
                  <option value="Peripherals">Peripherals</option>
                  <option value="Power">Power</option>
                  <option value="Smart Home">Smart Home</option>
                </select>
              </div>
            </div>

            {/* List entries */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {filteredProducts.map((p) => {
                const isSelected = p.id === selectedProductId;
                
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProductId(p.id)}
                    className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-between cursor-pointer group ${
                      isSelected
                        ? "bg-indigo-950/20 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                        : "bg-slate-950/30 border-white/5 hover:border-white/10 hover:bg-slate-950/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 rounded-lg flex items-center justify-center border border-white/5 relative overflow-hidden bg-slate-900"
                        style={{ boxShadow: `inset 0 0 10px ${p.color}25` }}
                      >
                        <Box className="h-4 w-4" style={{ color: p.color }} />
                        <div
                          className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: p.color }}
                        />
                      </div>

                      <div>
                        <h4 className="text-white font-medium text-xs leading-none">{p.name}</h4>
                        <span className="text-[10px] font-mono text-slate-400 mt-1.5 block">
                          {p.category} • <span className="text-slate-300">${p.price}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* State status */}
                      <div className="text-right flex flex-col items-end">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono ${
                          p.status === "in-stock"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : p.status === "low-stock"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}>
                          {p.inventory === 0 ? "OUT OF STOCK" : `${p.inventory} UNITS`}
                        </span>
                        
                        <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-0.5 mt-1">
                          <TrendingUp className="h-2.5 w-2.5" />
                          +{p.growth}% sales
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProduct(p.id);
                        }}
                        className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100 duration-200 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

         {/* Column 2: 3D Preview pane */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 shadow-2xl backdrop-blur-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-pink-400" />
              Orbital Mesh Telemetry
            </h3>

            {selectedProduct ? (
              <div className="space-y-4">
                <Product3DPreview product={selectedProduct} />
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block uppercase font-semibold">LTV Core yield</span>
                    <span className="text-sm font-semibold text-white mt-0.5 block">
                      ${(selectedProduct.sales * selectedProduct.price).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase font-semibold">Conversion Score</span>
                    <span className="text-sm font-semibold text-[#6366f1] mt-0.5 block">
                      {Math.floor(selectedProduct.growth * 1.4 + 20) / 10}% conversion
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[280px] border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-slate-500 text-xs text-center font-mono p-10">
                No active target SKU selected for mesh sync.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drag & Drop simulated promotion classifier pipeline */}
      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-2xl">
        <div className="mb-6">
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Box className="h-4 w-4 text-emerald-400" />
            Tactical Classifier & Promotion Pipeline
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic categorization engine. Tap or shift products to immediately relocate them between tactical merchandising segments.
          </p>
        </div>

        {/* 3 Pipeline Lanes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Lane 1: Core Catalog */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 min-h-[140px] flex flex-col justify-between">
            <div>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300 uppercase font-semibold">
                Core Catalog
              </span>
              <div className="space-y-2 mt-3.5">
                {products.filter(p => (promotionTiers[p.id] || "core") === "core").map(p => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded bg-slate-900 border border-white/5 flex items-center justify-between hover:border-indigo-500/20 duration-200"
                  >
                    <span className="text-[11px] font-medium text-white">{p.name}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => moveProductTier(p.id, "trending")}
                        className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-[9px] font-mono text-indigo-400 hover:bg-indigo-500 hover:text-white transition cursor-pointer"
                        title="Promote to Trending"
                      >
                        ⚡ Promo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {products.filter(p => (promotionTiers[p.id] || "core") === "core").length === 0 && (
              <span className="text-[10px] font-mono text-slate-600 block mt-4">Empty pipeline lane.</span>
            )}
          </div>

          {/* Lane 2: Trending / Hot Promos */}
          <div className="bg-indigo-950/10 p-4 rounded-xl border border-indigo-500/10 min-h-[140px] flex flex-col justify-between">
            <div>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-[10px] font-mono text-indigo-400 uppercase font-semibold">
                Trending / Promos
              </span>
              <div className="space-y-2 mt-3.5">
                {products.filter(p => promotionTiers[p.id] === "trending").map(p => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded bg-slate-900 border border-indigo-500/20 flex items-center justify-between duration-200"
                  >
                    <span className="text-[11px] font-medium text-indigo-300">{p.name}</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => moveProductTier(p.id, "core")}
                        className="px-1 py-0.5 rounded bg-slate-800 text-[9px] font-mono text-slate-400 hover:bg-slate-700 hover:text-white transition cursor-pointer"
                      >
                        ↙ Store
                      </button>
                      <button
                        onClick={() => moveProductTier(p.id, "liquidation")}
                        className="px-1 py-0.5 rounded bg-pink-500/20 text-[9px] font-mono text-pink-400 hover:bg-pink-500 hover:text-white transition cursor-pointer"
                      >
                        ↘ Bundle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {products.filter(p => promotionTiers[p.id] === "trending").length === 0 && (
              <span className="text-[10px] font-mono text-indigo-500/60 block mt-4">No SKU promoted currently.</span>
            )}
          </div>

          {/* Lane 3: Liquidation Assets */}
          <div className="bg-pink-950/10 p-4 rounded-xl border border-pink-500/10 min-h-[140px] flex flex-col justify-between">
            <div>
              <span className="px-2 py-0.5 rounded bg-pink-500/20 text-[10px] font-mono text-pink-400 uppercase font-semibold">
                Liquidation / Bundles
              </span>
              <div className="space-y-2 mt-3.5">
                {products.filter(p => promotionTiers[p.id] === "liquidation").map(p => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded bg-slate-900 border border-pink-500/20 flex items-center justify-between duration-200"
                  >
                    <span className="text-[11px] font-medium text-pink-400">{p.name}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => moveProductTier(p.id, "core")}
                        className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-mono text-slate-400 hover:bg-slate-700 hover:text-white transition cursor-pointer"
                      >
                        ↙ Catalogue
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {products.filter(p => promotionTiers[p.id] === "liquidation").length === 0 && (
              <span className="text-[10px] font-mono text-pink-500/60 block mt-4">No bundle liquidation targets.</span>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
