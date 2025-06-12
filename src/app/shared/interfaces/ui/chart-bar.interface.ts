export interface ChartBarItem {
  label: string;
  color: string;
  quantity: number;
}

export interface ChartBarData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderRadius?: number;
    barPercentage?: number;
  }[];
}
