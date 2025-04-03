import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { $Chapter, $Page, $Item, $Ending } from '../types';

interface GameState {
  chapters: $Chapter[];
  pages: $Page[];
  items: $Item[];
  endings: $Ending[];
}

const initialState: GameState = {
  chapters: [],
  pages: [],
  items: [],
  endings: [],
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setChapters(state, action: PayloadAction<$Chapter[]>) {
      state.chapters = action.payload;
    },
    setPages(state, action: PayloadAction<$Page[]>) {
      state.pages = action.payload;
    },
    setItems(state, action: PayloadAction<$Item[]>) {
      state.items = action.payload;
    },
    setEndings(state, action: PayloadAction<$Ending[]>) {
      state.endings = action.payload;
    },
  },
});

export const { setChapters, setPages, setItems, setEndings } = gameSlice.actions;
export default gameSlice.reducer;