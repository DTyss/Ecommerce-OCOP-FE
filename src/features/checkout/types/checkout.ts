export interface CheckoutAddress {
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
}

export type ShippingMethod = "standard" | "express" | "economy";

export interface ShippingOption {
  method: ShippingMethod;
  label: string;
  price: number;
  estimatedDays: string;
  provider: string;
}

export type PaymentMethod = "cod" | "bank_transfer" | "wallet";

export interface PaymentOption {
  method: PaymentMethod;
  label: string;
  icon: string;
  description: string;
}
