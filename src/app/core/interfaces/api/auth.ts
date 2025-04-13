export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  currentBranch: string | null;
}

export interface User {
  userId: string;
  numDni: string;
  name: string;
  firstLastname: string;
  secondLastname: string;
  email: string;
  address: string;
  phone: string;
  birthDate: string;
  emailVerified: boolean;
  photoUrl?: string;
  role: Role;
}

export interface Role {
  roleId: string;
  roleName: string;
  description: string;
}
