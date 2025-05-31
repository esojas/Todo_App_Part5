import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

// Async thunks
export const getAllTodos = createAsyncThunk(
    'todo/getAllTodos',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/todo/get_all');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createTodo = createAsyncThunk(
    'todo/createTodo',
    async (todoData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/todo/add_todo', todoData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateTodo = createAsyncThunk(
    'todo/updateTodo',
    async ({ id, todoData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`/todo/update_todo/${id}`, todoData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteTodo = createAsyncThunk(
    'todo/deleteTodo',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/todo/delete_todo/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    todos: [],
    loading: false,
    error: null,
};

const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get All Todos
            .addCase(getAllTodos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllTodos.fulfilled, (state, action) => {
                state.loading = false;
                state.todos = action.payload;
            })
            .addCase(getAllTodos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Todo
            .addCase(createTodo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTodo.fulfilled, (state, action) => {
                state.loading = false;
                state.todos.push(action.payload);
            })
            .addCase(createTodo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Todo
            .addCase(updateTodo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTodo.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.todos.findIndex(todo => todo._id === action.payload._id);
                if (index !== -1) {
                    state.todos[index] = action.payload;
                }
            })
            .addCase(updateTodo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Todo
            .addCase(deleteTodo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTodo.fulfilled, (state, action) => {
                state.loading = false;
                state.todos = state.todos.filter(todo => todo._id !== action.payload);
            })
            .addCase(deleteTodo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = todoSlice.actions;
export default todoSlice.reducer; 