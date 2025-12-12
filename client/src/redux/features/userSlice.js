import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "User",
  initialState: {
    user: null,
    listFavorites: []
  },
  reducers: {
    setUser: (state, action) => {
      const data = action.payload;

      // Nếu logout
      if (data === null) {
        localStorage.removeItem("actkn");
        state.user = null;
        return;
      }

      // Nếu login thành công
      if (data.token) {
        localStorage.setItem("actkn", data.token);
      }

      // CHỈ LƯU THÔNG TIN CẦN THIẾT
      state.user = {
        id: data.id,
        role: data.role,
        displayName: data.displayName
      };
    },

    setListFavorites: (state, action) => {
      state.listFavorites = action.payload;
    },

    removeFavorite: (state, action) => {
      const { mediaId } = action.payload;
      state.listFavorites = [...state.listFavorites].filter(
        e => e.mediaId.toString() !== mediaId.toString()
      );
    },

    addFavorite: (state, action) => {
      state.listFavorites = [action.payload, ...state.listFavorites];
    }
  }
});

export const {
  setUser,
  setListFavorites,
  addFavorite,
  removeFavorite
} = userSlice.actions;

export default userSlice.reducer;
