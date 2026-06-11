export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  inventory: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
  sales: number;
  growth: number;
  color: string;
  threeDType: "sphere" | "torus" | "cube" | "knot";
}

export interface MetricCard {
  title: string;
  value: string;
  change: number;
  timeframe: string;
  trend: "up" | "down" | "neutral";
  colorStr: string;
}

export interface Order {
  id: string;
  customerName: string;
  avatar: string;
  productName: string;
  amount: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  time: string;
  coordinates: [number, number, number]; // 3D placement coordinates
  region: string;
}

export interface CustomerSegment {
  name: string;
  count: number;
  percentage: number;
  growth: number;
  spendRating: "elite" | "premium" | "standard";
  color: string;
}

export interface AIInsightRecommendation {
  id: string;
  type: "revenue" | "inventory" | "marketing" | "general";
  title: string;
  priority: "high" | "medium" | "low";
  observation: string;
  actionItem: string;
  potentialImpact: string;
}

export interface AIForecast {
  nextMonthTarget: number;
  growthDriver: string;
  confidenceMetric: number;
}
