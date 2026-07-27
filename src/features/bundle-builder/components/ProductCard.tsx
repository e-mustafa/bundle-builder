import { cn } from '../../../shared/utils';
import { useBundleStore } from '../stores/useBundleStore';
import type { Product } from '../types';
import { getItemKey } from '../utils/bundle';
import StepIcon from './StepIcon';

interface ProductCardProps {
	product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
	// Fine-grained Zustand selectors to prevent unnecessary re-renders
	const quantities = useBundleStore((state) => state.quantities);
	const activeVariants = useBundleStore((state) => state.activeVariants);
	const setActiveVariant = useBundleStore((state) => state.setActiveVariant);
	const updateQuantity = useBundleStore((state) => state.updateQuantity);

	const currentVariantId = product.hasVariants ? activeVariants[product.id] || product.defaultVariantId : undefined;

	const itemKey = getItemKey(product.id, currentVariantId);
	const currentQty = quantities[itemKey] || 0;

	// Calculate total count across all variants of this product to set border highlight state
	const totalProductQty = product.hasVariants
		? product.variants?.reduce((sum, v) => sum + (quantities[getItemKey(product.id, v.id)] || 0), 0) || 0
		: currentQty;

	const isSelected = totalProductQty > 0;

	return (
		<div
			className={cn(
				'relative min-h-full flex flex-col lg:flex-row gap-4.75 justify-between p-2.75 bg-white rounded-[10px] border-2 transition-all duration-200',
				isSelected ? 'border-brand-primary/70' : 'border-white hover:border-gray-300',
			)}
		>
			{/* Optional Badge */}
			{product.badge && (
				<span className='absolute top-3 inset-s-3 bg-brand-primary text-white text-xs font-semibold px-1.5 py-0.5 rounded-full uppercase'>
					{product.badge.text}
				</span>
			)}

			{/* Image & Description */}
			<div className='flex-1 grid place-items-center'>
				<img src={product.image} alt={product.title} className='object-contain mx-auto' />
			</div>

			<div className='h-full flex flex-col items-start justify-between gap-2.5 flex-2'>
				<div className='flex flex-col'>
					<h3 className='text-text-title text-base font-semibold pb-2'>{product.title}</h3>
					<p className='text-xs font-medium text-text-muted mt-1 line-clamp-2 leading-[130%]'>
						<span>{product.description} </span>
						{product.learnMoreUrl && (
							<a
								href={product.learnMoreUrl}
								className='text-xs text-text-link hover:text-brand-primary underline tracking-[0.6px]'
							>
								Learn More
							</a>
						)}
					</p>
				</div>

				{/* Color / Variant Selector */}
				{product.hasVariants && product.variants && (
					<div className='flex items-center gap-1.5 flex-wrap'>
						{product.variants.map((v) => {
							const isVariantActive = v.id === currentVariantId;
							return (
								<button
									key={v.id}
									type='button'
									onClick={() => setActiveVariant(product.id, v.id)}
									aria-pressed={isVariantActive}
									aria-label={`Select ${v.name} option`}
									className={cn(
										'flex items-center gap-px h-6.5 px-1.25 py-px rounded-xs border-[0.5px] text-text-title text-[10px] font-medium transition-all',
										isVariantActive ? 'border-green bg-green-light' : 'border-border-default hover:bg-green-light',
									)}
								>
									{v.img && (
										<img src={v.img} alt={`${v.name} thumbnail`} className='size-7 max-h-full rounded-[5px]' />
									)}
									{v.name}
								</button>
							);
						})}
					</div>
				)}

				{/* Stepper and Price */}
				<div className='w-full flex items-center gap-3 justify-between'>
					<div className='flex items-center rounded p-1'>
						<button
							type='button'
							onClick={() => updateQuantity(product.id, currentVariantId, -1)}
							disabled={currentQty === 0}
							aria-label={`Decrease quantity for ${product.title}`}
							className='size-5 flex items-center justify-center border-2 border-gray-c200 bg-gray-c200 text-gray-c700 hover:shadow-md rounded disabled:border-gray-c200 disabled:text-gray-c200 disabled:bg-transparent disabled:cursor-not-allowed'
						>
							<StepIcon name='-' className='size-2' />
						</button>
						<span className='min-w-6.5 text-center text-base font-medium leading-5 text-gray-c900 select-none'>
							{currentQty}
						</span>
						<button
							type='button'
							onClick={() => updateQuantity(product.id, currentVariantId, 1)}
							aria-label={`Increase quantity for ${product.title}`}
							className='size-5 flex items-center justify-center bg-gray-c200 text-gray-c700 hover:shadow-md rounded'
						>
							<StepIcon name='+' className='size-2' />
						</button>
					</div>

					<div className='flex flex-col md:flex-row lg:flex-col gap-x-3 justify-center text-end tracking-[0.6px] leading-tight'>
						{product.compareAtPrice && (
							<span className='block text-sm text-red-500 line-through'>${product.compareAtPrice.toFixed(2)}</span>
						)}
						<span className='text-sm text-gray-c500'>
							${product.price.toFixed(2)}
							{product.unitSuffix || ''}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
