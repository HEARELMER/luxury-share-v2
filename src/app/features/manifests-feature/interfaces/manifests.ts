export interface Manifest {
  manifestId: string;
  serviceId: string;
  serviceType: string;
  date: string;
  title: string;
  description: string;
  status: string;
  registeredBy: string;
  createdAt: string;
  updatedAt: string;
  checkedInCount: number;
}

export interface ManifestPassenger {
  passengerId: string;
  manifestId: string;
  clientId: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  checkIn: boolean;
  nationality?: string;
  dietaryRestrictions?: string;
  specialNeeds?: string;
}