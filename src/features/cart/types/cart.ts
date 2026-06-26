export interface CartItem {
  productId: string;
  quantity: number;
  selected: boolean;
  promotionType: "bundle" | "flashSale" | null;
  snapshot: {
    name: string;
    image: string;
    price: number;
    originalPrice: number | null;
  };
}
