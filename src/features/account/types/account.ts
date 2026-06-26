export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string | null;
  joinedDate: string;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  isDefault: boolean;
}
