import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signup, activateEmail } from '../features/auth/authSlice';

const Signup = () => {
    const [formData, setFormData] = useState({
        personal_id: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        phone_number: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [activationToken, setActivationToken] = useState('');
    const [showActivation, setShowActivation] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, activationStatus } = useSelector((state) => state.auth);

    const validateForm = () => {
        const errors = {};
        
        // Name validation
        if (formData.name.length < 3) {
            errors.name = "Name must be at least 3 letters long";
        }

        // Email validation
        const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(formData.email)) {
            errors.email = "Invalid email format";
        }

        // Password validation
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        if (!passwordRegex.test(formData.password)) {
            errors.password = "Password must be 6-20 characters long with at least one number, one lowercase and one uppercase letter";
        }

        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords don't match";
        }

        // Required fields validation
        if (!formData.personal_id) errors.personal_id = "Personal ID is required";
        if (!formData.name) errors.name = "Name is required";
        if (!formData.email) errors.email = "Email is required";
        if (!formData.password) errors.password = "Password is required";
        if (!formData.confirmPassword) errors.confirmPassword = "Please confirm your password";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        const result = await dispatch(signup(formData));
        if (!result.error) {
            setShowActivation(true);
        }
    };

    const handleActivation = async (e) => {
        e.preventDefault();
        const result = await dispatch(activateEmail(activationToken));
        if (!result.error) {
            navigate('/login');
        }
    };

    const renderError = () => {
        if (!error) return null;
        if (typeof error === 'string') return <div className="text-red-500 text-sm">{error}</div>;
        if (error.message) return <div className="text-red-500 text-sm">{error.message}</div>;
        return <div className="text-red-500 text-sm">An error occurred</div>;
    };

    const renderFieldError = (fieldName) => {
        if (formErrors[fieldName]) {
            return <div className="text-red-500 text-xs mt-1">{formErrors[fieldName]}</div>;
        }
        return null;
    };

    if (showActivation) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Activate Your Account
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Please enter the activation token sent to your email
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleActivation}>
                        <div>
                            <label htmlFor="activation_token" className="sr-only">
                                Activation Token
                            </label>
                            <input
                                id="activation_token"
                                name="activation_token"
                                type="text"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Activation Token"
                                value={activationToken}
                                onChange={(e) => setActivationToken(e.target.value)}
                            />
                        </div>
                        {renderError()}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {loading ? 'Activating...' : 'Activate Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                name="personal_id"
                                type="text"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${formErrors.personal_id ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Personal ID"
                                value={formData.personal_id}
                                onChange={handleChange}
                            />
                            {renderFieldError('personal_id')}
                        </div>
                        <div>
                            <input
                                name="name"
                                type="text"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {renderFieldError('name')}
                        </div>
                        <div>
                            <input
                                name="email"
                                type="email"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {renderFieldError('email')}
                        </div>
                        <div>
                            <input
                                name="password"
                                type="password"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {renderFieldError('password')}
                        </div>
                        <div>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {renderFieldError('confirmPassword')}
                        </div>
                        <div>
                            <input
                                name="address"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                name="phone_number"
                                type="tel"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Phone Number"
                                value={formData.phone_number}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {renderError()}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {loading ? 'Signing up...' : 'Sign up'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup; 