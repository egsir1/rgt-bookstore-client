'use client';

import { FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Spinner } from '../spinner';
import { useLogin, useSignup } from '@/hooks/use-auth';

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

const signupSchema = loginSchema
	.extend({
		fullName: z.string().min(2),
		confirmPassword: z.string().min(6),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

const forgotSchema = z.object({
	email: z.string().email(),
});

type LoginType = z.infer<typeof loginSchema>;
type SignupType = z.infer<typeof signupSchema>;
type ForgotType = z.infer<typeof forgotSchema>;
type FormType = LoginType | SignupType | ForgotType;

export default function AuthForm() {
	const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
	const router = useRouter();
	const [showMessage, setShowMessage] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormType>({
		resolver: zodResolver(
			mode === 'login'
				? loginSchema
				: mode === 'signup'
				? signupSchema
				: forgotSchema
		),
	});

	const signup = useSignup();
	const login = useLogin();

	const onSubmit = async (data: any) => {
		if (mode === 'signup') {
			signup.mutate(data, {
				onSuccess: response => {
					console.log('🚀 ~ onSubmit ~ response:', response);

					localStorage.setItem('att', response?.verificationToken);
					toast.success('Signup successful. Check your email to verify');
					router.push('/auth/verify');
				},
				onError: (err: any) => {
					const parsed = JSON.parse(err.message);
					toast.error(parsed.errorMessage || 'Signup failed');
				},
			});
			console.log('🚀 ~ onSubmit ~ data:', data);
		} else if (mode === 'login') {
			login.mutate(data, {
				onSuccess: () => {
					toast.success('Login successful');
					router.replace('/');
				},
				onError: (err: any) => {
					const parsed = JSON.parse(err.message);
					toast.error(parsed.errorMessage || 'Login failed');
				},
			});
		}
	};

	return (
		<motion.div
			className='w-full max-w-md rounded-xl bg-white  p-8  dark:bg-gray-900'
			initial={{ opacity: 0, y: 40 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
		>
			<h2 className='mb-6 text-center text-2xl font-bold'>
				{mode === 'login'
					? 'Login to your account'
					: mode === 'signup'
					? 'Create your account'
					: 'Recover your password'}
			</h2>

			<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
				{mode === 'signup' && (
					<div>
						<Label className='mb-1'>Full Name</Label>
						<Input {...register('fullName')} />
						{(errors as FieldErrors<SignupType>)?.fullName && (
							<p className='text-sm text-red-500'>
								{(errors as FieldErrors<SignupType>).fullName?.message}
							</p>
						)}
					</div>
				)}

				<div>
					<Label className='mb-1'>Email</Label>
					<Input type='email' {...register('email')} />
					{errors.email && (
						<p className='text-sm text-red-500'>
							{errors.email.message as string}
						</p>
					)}
				</div>

				{mode !== 'forgot' && (
					<div>
						<Label className='mb-1'>Password</Label>
						<Input type='password' {...register('password')} />
						{(errors as FieldErrors<LoginType | SignupType>)?.password && (
							<p className='text-sm text-red-500'>
								{
									(errors as FieldErrors<LoginType | SignupType>).password
										?.message
								}
							</p>
						)}
					</div>
				)}

				{mode === 'signup' && (
					<div>
						<Label className='mb-1'>Confirm Password</Label>
						<Input type='password' {...register('confirmPassword')} />
						{(errors as FieldErrors<SignupType>)?.confirmPassword && (
							<p className='text-sm text-red-500'>
								{(errors as FieldErrors<SignupType>).confirmPassword?.message}
							</p>
						)}
					</div>
				)}

				<Button
					type='submit'
					className='w-full'
					disabled={signup.status === 'pending' || login.status === 'pending'}
				>
					{(mode === 'signup' && signup.status === 'pending') ||
						(mode === 'login' && login.status === 'pending' && (
							<span className='flex items-center justify-center gap-2'>
								<Spinner />
								Processing...
							</span>
						))}
					{(mode === 'signup' && signup.status !== 'pending' && 'Sign Up') ||
						(mode === 'login' && login.status !== 'pending' && 'Login')}
				</Button>
			</form>
			{mode === 'forgot' && showMessage && (
				<p className='text-center mt-5 bg-red-50 text-red-300 px-3 rounded-sm'>
					Please check your email and click the link to update your password
				</p>
			)}
			<p className='mt-4 text-center text-sm'>
				{mode === 'login' ? (
					<>
						Don't have an account?{' '}
						<button
							onClick={() => setMode('signup')}
							className='text-blue-600 underline'
						>
							Sign Up
						</button>{' '}
					</>
				) : mode === 'signup' ? (
					<>
						Already registered?{' '}
						<button
							onClick={() => setMode('login')}
							className='text-blue-600 underline'
						>
							Login
						</button>
					</>
				) : (
					<>
						Go back to{' '}
						<button
							onClick={() => {
								setShowMessage(false);
								setMode('login');
							}}
							className='text-blue-600 underline'
						>
							Login
						</button>
					</>
				)}
			</p>
		</motion.div>
	);
}
