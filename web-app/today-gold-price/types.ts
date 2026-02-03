
export interface GoldData {
  price: number;
  currency: string;
  unit: string;
  lastUpdated: string;
  summary: string;
  sources: { title: string; uri: string }[];
  trend: { date: string; value: number }[];
}

export interface AppState {
  data: GoldData | null;
  loading: boolean;
  error: string | null;
}
