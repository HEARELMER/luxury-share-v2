export interface UserAccessing {
  userId: string;
  password: string;
}

export interface RefToken {
  refreshToken: string;
}

export interface UserAuthorized {
  name: string;
  email: string;
  photoUrl: string;
  phone: string;
  address: string;
  birthDate: string;
  roleId: string;
  numDni: string;
  firstLastname: string;
  secondLastname: string;
  userId: string;
}

export interface UserFromApiSearch {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  tipoDocumento: string;
  numeroDocumento: string;
  digitoVerificador: string;
}

export interface NewAdmin {
  user: {
    numDni: string;
    name: string;
    firstLastname: string;
    secondLastname: string;
    email: string;
    address: string;
    birthDate: string;
    phone: string;
    photoUrl: string;
  };
  admin: {
    profession: string;
    description: string;
  };
}

export interface userSelectedInfo {
  dni: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  profession: string;
  address: string;
  birthDate: string;
}

export interface UserResponse {
  usuarios: {
    data: User[];
    total: number;
    page: string;
    limit: string;
  };
  estado: string;
  mensaje: string;
}

export interface User {
  name: string;
  email: string;
  photoUrl: string;
  phone: string;
  address: string;
  birthDate: string;
  roleId: string;
  numDni: string;
  firstLastname: string;
  secondLastname: string;
  userId: string;
}