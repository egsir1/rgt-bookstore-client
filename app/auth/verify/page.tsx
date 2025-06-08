'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useVerify } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/spinner';

export default function VerifyPage() {
	const [otpValues, setOtpValues] = useState(Array(6).fill(''));
	const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
	const router = useRouter();
	const handleChange = (index: number, value: string) => {
		if (!/^\d?$/.test(value)) return;

		const newOtp = [...otpValues];
		newOtp[index] = value;
		setOtpValues(newOtp);

		if (value && index < 5) {
			inputsRef.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
		if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
			inputsRef.current[index - 1]?.focus();
		}
	};

	const verifyEmail = useVerify();
	const handleVerify = async () => {
		const otp = otpValues.join('');
		if (otp.length !== 6) return toast.error('Please enter a 6-digit code');
		console.log('Verifying OTP:', otp);
		verifyEmail.mutate(otp, {
			onSuccess: () => {
				toast.success('Email verification successful');
				router.push('/');
			},
			onError: (err: any) => {
				const parsed = JSON.parse(err.message);
				toast.error(parsed.errorMessage || 'Verification failed');
			},
		});
	};

	return (
		<div className='flex min-h-screen items-center justify-center bg-gray-100 dark:bg-black'>
			<div className='w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-xl dark:bg-gray-900'>
				<h2 className='text-2xl font-bold text-center'>Verify your email</h2>
				<p className='text-center text-sm text-gray-500'>
					Enter the 6-digit code sent to your email
				</p>

				<div className='flex justify-center gap-3'>
					{otpValues.map((digit, index) => (
						<Input
							key={index}
							type='text'
							inputMode='numeric'
							maxLength={1}
							ref={el => {
								inputsRef.current[index] = el;
							}}
							className='w-10 text-center text-xl tracking-wider'
							value={digit}
							onChange={e => handleChange(index, e.target.value)}
							onKeyDown={e => handleKeyDown(e, index)}
						/>
					))}
				</div>

				<div className='flex justify-center'>
					<Button onClick={handleVerify} className='w-75 cursor-pointer'>
						{verifyEmail.status === 'pending' ? (
							<span className='flex items-center justify-center gap-2'>
								<Spinner />
								Processing...
							</span>
						) : (
							'Verify'
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}
