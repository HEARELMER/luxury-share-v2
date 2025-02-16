export interface DashboardData {
  message: string;
  data: Data;
  usersData: UsersData;
}

export interface Data {
  totalSales: number;
  topSellingPackages: TopSellingPackage[];
  topSellingServices: TopSellingService[];
  countPackages: number;
  countServices: number;
  salesByMonth: SalesByMonth[];
  salesByDay: SalesByDay[];
  salesByYear: SalesByYear[];
  totalSalesByBranch: TotalSalesByBranch[];
}

export interface TopSellingPackage {
  id_package: string;
  packagename: string;
  soldquantity: string;
}

export interface TopSellingService {
  id_service: string;
  servicename: string;
  soldquantity: string;
}

export interface SalesByMonth {
  month: string;
  totalsales: string;
}

export interface SalesByDay {
  day: string;
  totalsales: string;
}

export interface SalesByYear {
  year: string;
  totalsales: string;
}

export interface UsersData {
  totalUsers: number;
  totalAdmins: number;
  totalSellers: number;
  totalGerents: number;
}

export interface TotalSalesByBranch {
  sucursalId: string;
  address: string;
  totalsales: string;
}
