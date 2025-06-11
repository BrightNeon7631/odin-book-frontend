import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormField from '../components/Reusables/FormField';
import {
  type LoginFormData,
  LoginUserSchema,
  type CreateOrLoginUserResponse,
  type AuthContextType,
} from '../../types';
import { Link } from 'react-router-dom';
import { MdOutlineEmail, MdLockOutline } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../provider/authProvider';
import axios from 'axios';

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formStatus, setFormStatus] = useState('idle');
  const [error, setError] = useState<string | null>(null);
  const { setToken } = useAuth() as AuthContextType;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginUserSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setFormStatus('submitting');
    setError(null);
    try {
      const res = await axios.post<CreateOrLoginUserResponse>(
        '/user/login',
        data,
      );
      setToken(res.data.token);
      navigate('/app', { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err?.response?.data?.error || err?.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setFormStatus('idle');
    }
  };

  return (
    <div className='flex flex-4 flex-col justify-center p-8'>
      {(error || location?.state?.message) && (
        <div className='mt-4 mb-4 rounded-lg bg-blue-100 py-4 text-center font-semibold'>
          {location?.state?.message && !error
            ? location?.state?.message
            : error}
        </div>
      )}
      <h1 className='mb-6 text-2xl font-bold text-white'>Sign In</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex max-w-5xl flex-col gap-3'
      >
        <div className='flex flex-col gap-1'>
          <label className='font-bold text-slate-500'>Email</label>
          <FormField
            type='email'
            placeholder='Enter your email address'
            name='email'
            register={register}
            error={errors.email}
            Icon={MdOutlineEmail}
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='font-bold text-slate-500'>Password</label>
          <FormField
            type='password'
            placeholder='Enter your password'
            name='password'
            register={register}
            error={errors.password}
            Icon={MdLockOutline}
          />
        </div>
        <button
          className='mt-2 h-10 cursor-pointer rounded-md bg-indigo-700 font-bold text-white hover:opacity-80'
          type='submit'
          disabled={formStatus === 'submitting'}
        >
          Sign in
        </button>
      </form>
      <div className='mt-6 max-w-5xl text-center text-white'>
        Don't have an account?{' '}
        <Link
          to='/register'
          className='font-bold text-blue-800 hover:underline'
        >
          Sign up now!
        </Link>
      </div>
    </div>
  );
}
