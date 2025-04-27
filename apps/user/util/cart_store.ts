import { create } from "@pkg/ui";

type CartStore = {
  inCartProducts: number[];
  addToCart: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
};

export const useCart = create<CartStore>((set) => ({
  inCartProducts: [],
  addToCart: (productId) =>
    set((state) => ({
      inCartProducts: [...state.inCartProducts, productId],
    })),
  removeFromCart: (productId) =>
    set((state) => ({
      inCartProducts: state.inCartProducts.filter((id) => id !== productId),
    })),
  clearCart: () =>
    set(() => ({
      inCartProducts: [],
    })),
}));
