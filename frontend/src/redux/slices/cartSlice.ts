import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { cartStorage } from '@/utils/storage';
import type { Vehicle } from '@/types/vehicle.types';

interface CartState {
  items: Vehicle[];
}

const initialState: CartState = { items: cartStorage.load<Vehicle>() };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Vehicle>) => {
      if (!state.items.some((item) => item.id === action.payload.id)) {
        state.items.push(action.payload);
        cartStorage.save(state.items);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      cartStorage.save(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      cartStorage.save(state.items);
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
