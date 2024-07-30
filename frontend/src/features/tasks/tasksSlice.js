import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTasks, updateTaskColumn } from './tasksAPI';

export const loadTasks = createAsyncThunk(
  'tasks/loadTasks',
  async () => {
    const response = await fetchTasks();
    return response.data;
  }
);

export const moveTask = createAsyncThunk(
  'tasks/moveTask',
  async ({ taskId, newColumn }) => {
    const response = await updateTaskColumn(taskId, newColumn);
    return response.data;
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadTasks.fulfilled, (state, action) => action.payload)
      .addCase(moveTask.fulfilled, (state, action) => {
        const index = state.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state[index] = action.payload;
        }
      });
  },
});

export default tasksSlice.reducer;
