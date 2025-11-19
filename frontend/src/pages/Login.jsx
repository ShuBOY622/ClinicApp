import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { login } from '../services/authService';
import { FaStethoscope, FaArrowLeft } from 'react-icons/fa';

const Login = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        try {
            const response = await login(data);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-blue-50">
            <div className="absolute top-4 left-4">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-slate-600 hover:text-slate-800 transition-colors"
                >
                    <FaArrowLeft className="mr-2" />
                    Back to Home
                </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100">
                <div className="flex items-center justify-center mb-6">
                    <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-3 rounded-xl">
                        <FaStethoscope className="h-8 w-8 text-white" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                    Doctor Login
                </h2>
                <p className="text-center text-slate-600 mb-8">
                    Access your clinic management portal
                </p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            {...register('username', { required: 'Username is required' })}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all"
                            placeholder="Enter your username"
                        />
                        {errors.username && (
                            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            {...register('password', { required: 'Password is required' })}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all"
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-sky-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-600 mt-6">
                    Dr. Ramesh Tarakh Clinic Management System
                </p>
            </div>
        </div>
    );
};

export default Login;
