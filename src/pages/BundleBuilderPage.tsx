import { BundleBuilder, useBundleData } from '../features/bundle-builder';

export default function BundleBuilderPage() {
	const { data, isLoading, error } = useBundleData();

	if (isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-surface-subtle'>
				<div className='grid place-items-center p-5 rounded-lg shadow-md w-2xs bg-surface'>
					<p className='text-text-muted font-medium animate-pulse'>Loading Bundle Builder...</p>
				</div>
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-surface-subtle'>
				<div className='grid place-items-center p-5 rounded-lg shadow-md w-2xs bg-surface'>
					<p className='text-red-500 font-medium'>Error: {error || 'No data found'}</p>
				</div>
			</div>
		);
	}

	return <BundleBuilder initialData={data} />;
}
