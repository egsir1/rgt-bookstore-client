import { customAxios, HttpMethod } from '@/lib/custom-axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export const useSignup = () => {
	return useMutation({
		mutationFn: async (data: {
			fullName: string;
			email: string;
			password: string;
		}) => {
			const res = await customAxios({
				url: '/api-gateway/register',
				method: HttpMethod.POST,
				data,
			});
			console.log('🚀 ~ useSignup ~ res:', res);
			return res;
		},
	});
};
