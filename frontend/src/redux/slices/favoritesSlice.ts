import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  vehicleIds: string[];
}

const initialState: FavoritesState = { vehicleIds: [] };

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites: (state, action: PayloadAction<string[]>) => {
      state.vehicleIds = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const exists = state.vehicleIds.includes(action.payload);
      state.vehicleIds = exists
        ? state.vehicleIds.filter((id) => id !== action.payload)
        : [...state.vehicleIds, action.payload];
    },
  },
});

export const { setFavorites, toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
