import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: () => number;
  cartTotal: () => number;
  addItem: (item: { id: string; name: string; price: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
  cartTotal: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
  addItem: (item) => set((state) => {
    const existingItem = state.items.find(i => i.id === item.id);
    if (existingItem) {
      return {
        items: state.items.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    } else {
      return {
        items: [...state.items, { ...item, quantity: 1 }],
      };
    }
  }),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id),
  })),
  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map(item =>
      item.id === id ? { ...item, quantity: quantity } : item
    ),
  })),
  clearCart: () => set({ items: [] }),
}));