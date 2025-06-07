'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { FieldErrors, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Spinner } from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useRecoverPassword } from '@/hooks/use-auth';

const formSchema = z
	.object({
		password: z.string().min(6),
		confirmPassword: z.string().min(6),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

type FormType = z.infer<typeof formSchema>;

const RecoverPasswordPage = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormType>({
		resolver: zodResolver(formSchema),
	});

	const searchParams = useSearchParams();
	const token = searchParams.get('token');
	console.log('🚀 ~ RecoverPasswordPage ~ token:', token);
	const router = useRouter();

	const recover = useRecoverPassword();

	const onSubmit = async (data: FormType) => {
		if (!token) {
			toast.error('Invalid or missing token');
			return;
		}

		recover.mutate(
			{ token, password: data.password },
			{
				onSuccess: () => {
					toast.success('Password successfully updated');
					router.push('/');
				},
				onError: (err: any) => {
					const parsed = JSON.parse(err.message || '{}');
					toast.error(parsed.errorMessage || 'Failed to reset password');
				},
			}
		);
	};

	return (
		<motion.div
			className='w-full max-w-md rounded-xl bg-white p-8  dark:bg-gray-900'
			initial={{ opacity: 0, y: 40 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
		>
			<h2 className='mb-6 text-center text-2xl font-bold'>
				Recover Your Password
			</h2>

			<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
				<div>
					<Label className='mb-1'>New Password</Label>
					<Input type='password' {...register('password')} />
					{errors.password && (
						<p className='text-sm text-red-500'>{errors.password.message}</p>
					)}
				</div>

				<div>
					<Label className='mb-1'>Confirm Password</Label>
					<Input type='password' {...register('confirmPassword')} />
					{errors.confirmPassword && (
						<p className='text-sm text-red-500'>
							{errors.confirmPassword.message}
						</p>
					)}
				</div>

				<Button
					type='submit'
					className='w-full'
					disabled={recover.status === 'pending'}
				>
					{recover.status === 'pending' ? (
						<span className='flex items-center justify-center gap-2'>
							<Spinner />
							Processing...
						</span>
					) : (
						'Recover'
					)}
				</Button>
			</form>
		</motion.div>
	);
};

export default RecoverPasswordPage;
