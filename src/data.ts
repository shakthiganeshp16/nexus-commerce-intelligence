import { Product, Order, CustomerSegment, MetricCard } from "./types";

export const initialProducts: Product[] = [
  {
    id: "prod-1",
    name: "Chronos Smartwatch V2",
    category: "Wearables",
    price: 349,
    inventory: 142,
    status: "in-stock",
    sales: 1240,
    growth: 18.4,
    color: "#6366f1", // Indigo
    threeDType: "knot",
  },
  {
    id: "prod-2",
    name: "Aether ANC Headphones",
    category: "Audio",
    price: 299,
    inventory: 45,
    status: "low-stock",
    sales: 980,
    growth: 24.1,
    color: "#a855f7", // Purple
    threeDType: "torus",
  },
  {
    id: "prod-3",
    name: "Spectra Ergonomic Keyboard",
    category: "Peripherals",
    price: 189,
    inventory: 188,
    status: "in-stock",
    sales: 640,
    growth: -4.2,
    color: "#3b82f6", // Blue
    threeDType: "cube",
  },
  {
    id: "prod-4",
    name: "Helix MagSafe Base",
    category: "Power",
    price: 89,
    inventory: 0,
    status: "out-of-stock",
    sales: 450,
    growth: 12.8,
    color: "#ec4899", // Pink
    threeDType: "sphere",
  },
  {
    id: "prod-5",
    name: "Aether Lumina Desk Lamp",
    category: "Smart Home",
    price: 149,
    inventory: 90,
    status: "in-stock",
    sales: 320,
    growth: 8.5,
    color: "#10b981", // Emerald
    threeDType: "torus",
  },
];

export const initialKPIs: MetricCard[] = [
  {
    title: "Gross Revenue (GMV)",
    value: "$718,240",
    change: 14.8,
    timeframe: "vs last month",
    trend: "up",
    colorStr: "from-indigo-500 to-purple-500",
  },
  {
    title: "Sales Forecast (Q2 CO)",
    value: "$843,200",
    change: 8.1,
    timeframe: "expected confidence 94%",
    trend: "up",
    colorStr: "from-purple-500 to-pink-500",
  },
  {
    title: "Active Orders",
    value: "2,481",
    change: 22.4,
    timeframe: "streaming live",
    trend: "up",
    colorStr: "from-emerald-400 to-teal-500",
  },
  {
    title: "Conversion Velocity",
    value: "3.42%",
    change: -1.2,
    timeframe: "vs 2.8% benchmark",
    trend: "down",
    colorStr: "from-blue-500 to-indigo-500",
  },
];

export const initialOrders: Order[] = [
  {
    id: "order-9201",
    customerName: "Alex Mercer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
    productName: "Chronos Smartwatch V2",
    amount: 349,
    status: "delivered",
    time: "2 mins ago",
    coordinates: [1.2, 0.8, -0.5],
    region: "Americas (NYC)",
  },
  {
    id: "order-9202",
    customerName: "Siddharth Dev",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    productName: "Aether ANC Headphones",
    amount: 598,
    status: "processing",
    time: "5 mins ago",
    coordinates: [-1.4, -0.6, 0.4],
    region: "APAC (Mumbai)",
  },
  {
    id: "order-9203",
    customerName: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    productName: "Spectra Ergonomic Keyboard",
    amount: 189,
    status: "pending",
    time: "12 mins ago",
    coordinates: [0.3, -1.2, -0.8],
    region: "EMEA (Berlin)",
  },
  {
    id: "order-9204",
    customerName: "Marcus Vance",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
    productName: "Chronos Smartwatch V2",
    amount: 349,
    status: "shipped",
    time: "25 mins ago",
    coordinates: [0.8, 1.4, 0.2],
    region: "Americas (SF)",
  },
  {
    id: "order-9205",
    customerName: "Yuki Tanaka",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120",
    productName: "Aether Lumina Desk Lamp",
    amount: 149,
    status: "delivered",
    time: "42 mins ago",
    coordinates: [-1.0, 1.0, -0.9],
    region: "APAC (Tokyo)",
  },
];

export const customerSegments: CustomerSegment[] = [
  { name: "Super-Whales", count: 480, percentage: 8.5, growth: 12.4, spendRating: "elite", color: "#6366f1" },
  { name: "High-LTV Engaged", count: 1820, percentage: 32.2, growth: 22.8, spendRating: "premium", color: "#3b82f6" },
  { name: "Value Seekers", count: 2450, percentage: 43.4, growth: 2.1, spendRating: "standard", color: "#a855f7" },
  { name: "Churn-Risk Dormant", count: 900, percentage: 15.9, growth: -8.5, spendRating: "standard", color: "#ec4899" },
];

export const revenueChartData = [
  { month: "Jan", actual: 420000, forecast: 420000, anomaly: false },
  { month: "Feb", actual: 480000, forecast: 460000, anomaly: false },
  { month: "Mar", actual: 350000, forecast: 490000, anomaly: true, detail: "Server Outage & Payment API timeout (EMEA)" },
  { month: "Apr", actual: 590000, forecast: 512000, anomaly: false },
  { month: "May", actual: 680000, forecast: 550000, anomaly: false },
  { month: "Jun", actual: 718240, forecast: 610000, anomaly: false },
  { month: "Jul", actual: null, forecast: 690000, anomaly: false },
  { month: "Aug", actual: null, forecast: 760000, anomaly: false },
  { month: "Sep", actual: null, forecast: 843200, anomaly: false },
];

export const trafficBehaviorData = [
  { day: "Mon", conversion: 2.9, bounce: 42, views: 18000 },
  { day: "Tue", conversion: 3.1, bounce: 39, views: 22000 },
  { day: "Wed", conversion: 3.8, bounce: 34, views: 28000 }, // Peak behavior
  { day: "Thu", conversion: 3.3, bounce: 38, views: 24000 },
  { day: "Fri", conversion: 2.8, bounce: 44, views: 19000 },
  { day: "Sat", conversion: 2.1, bounce: 51, views: 12000 },
  { day: "Sun", conversion: 2.4, bounce: 48, views: 14000 },
];
export const globalHeatmapMatrix = [
  { x: 10, y: 80, count: 85, region: "North America - NY" },
  { x: 25, y: 55, count: 42, region: "South America - Sao Paulo" },
  { x: 45, y: 75, count: 92, region: "Europe - Frankfurt" },
  { x: 50, y: 40, count: 30, region: "Africa - Lagos" },
  { x: 70, y: 78, count: 75, region: "Asia - Tokyo" },
  { x: 78, y: 30, count: 50, region: "Australia - Sydney" },
];
