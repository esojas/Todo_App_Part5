import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../utils/axios'

// Sign up
export const signup = createAsyncThunk(
    'auth/signup',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/user/signup', userData)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Signup failed')
        }
    }
)

// Activate email
export const activateEmail = createAsyncThunk(
    'auth/activateEmail',
    async (activationToken, { rejectWithValue }) => {
        try {
            const response = await axios.post('/user/activation', { activation_token: activationToken })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Activation failed')
        }
    }
)

// Sign in
export const signin = createAsyncThunk(
    'auth/signin',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/user/signin', userData)
            if (response.data.refresh_token) {
                localStorage.setItem('refresh_token', response.data.refresh_token)
            }
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Signin failed')
        }
    }
)

// Get user info
export const getUserInfo = createAsyncThunk(
    'auth/getUserInfo',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('refresh_token')
            if (!token) {
                throw new Error('No token found')
            }
            const response = await axios.get('/user/user-infor', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get user info')
        }
    }
)

// Logout
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            localStorage.removeItem('refresh_token')
            return null
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const initialState = {
    user: null,
    loading: false,
    error: null,
    activationStatus: null,
    token: localStorage.getItem('refresh_token'),
    isAuthenticated: !!localStorage.getItem('refresh_token')
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        clearActivationStatus: (state) => {
            state.activationStatus = null
        }
    },
    extraReducers: (builder) => {
        builder
            // Signup
            .addCase(signup.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.loading = false
                state.activationStatus = action.payload.message
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Activate Email
            .addCase(activateEmail.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(activateEmail.fulfilled, (state, action) => {
                state.loading = false
                state.activationStatus = action.payload.message
            })
            .addCase(activateEmail.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Signin
            .addCase(signin.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(signin.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload.user
                state.token = action.payload.refresh_token
                state.isAuthenticated = true
                state.error = null
            })
            .addCase(signin.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
                state.user = null
                state.token = null
                state.isAuthenticated = false
            })
            // Get User Info
            .addCase(getUserInfo.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.loading = false
                state.user = action.payload
                state.isAuthenticated = true
            })
            .addCase(getUserInfo.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
                state.user = null
                state.isAuthenticated = false
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null
                state.error = null
                state.token = null
                state.isAuthenticated = false
            })
    }
})

export const { clearError, clearActivationStatus } = authSlice.actions
export default authSlice.reducer