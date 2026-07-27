import { useEffect, useState } from 'react';
import type { BundleBuilderData } from '../types';

export function useBundleData() {
	const [data, setData] = useState<BundleBuilderData | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Simulate API fetch from local JSON source
		async function fetchData() {
			try {
				const response = await fetch('/data/bundle-data.json');
				if (!response.ok) {
					throw new Error('Failed to load bundle data');
				}
				const json: BundleBuilderData = await response.json();
				setData(json);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Unknown error');
			} finally {
				setIsLoading(false);
			}
		}

		fetchData();
	}, []);

	return { data, isLoading, error };
}
