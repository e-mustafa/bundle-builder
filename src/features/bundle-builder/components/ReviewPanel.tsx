import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useBundleStore } from '../stores/useBundleStore';
import type { BundleBuilderData, Product, Variant } from '../types';
import { getItemKey } from '../utils/bundle';
import StepIcon from './StepIcon';

interface ReviewPanelProps {
	data: BundleBuilderData;
}

export default function ReviewPanel({ data }: ReviewPanelProps) {
	const { quantities, updateQuantity } = useBundleStore();

	// Extract selected items with quantity > 0
	const selectedItems = useMemo(() => {
		const items: Array<{
			product: Product;
			variant?: Variant;
			quantity: number;
			itemKey: string;
		}> = [];

		data.steps.forEach((step) => {
			step.products.forEach((product) => {
				if (product.hasVariants && product.variants) {
					product.variants.forEach((v) => {
						const key = getItemKey(product.id, v.id);
						const qty = quantities[key] || 0;
						if (qty > 0) {
							items.push({ product, variant: v, quantity: qty, itemKey: key });
						}
					});
				} else {
					const key = getItemKey(product.id);
					const qty = quantities[key] || 0;
					if (qty > 0) {
						items.push({ product, quantity: qty, itemKey: key });
					}
				}
			});
		});

		return items;
	}, [data, quantities]);

	// Compute total and savings
	const { subtotal, compareAtSubtotal } = useMemo(() => {
		let sub = 0;
		let compareSub = 0;

		selectedItems.forEach(({ product, quantity }) => {
			sub += product.price * quantity;
			compareSub += (product.compareAtPrice !== undefined ? product.compareAtPrice : product.price) * quantity;
		});

		return { subtotal: sub, compareAtSubtotal: compareSub };
	}, [selectedItems]);

	const totalSavings = Math.max(0, compareAtSubtotal - subtotal);

	return (
		<div className='bg-surface-card pt-3.75 rounded-[10px] flex flex-col justify-between h-full'>
			<span className='text-xs tracking-[1.6px] text-text-muted uppercase pb-1.25 px-3.75'>REVIEW</span>
			<div className='flex flex-col gap-2.5 px-5 pt-5 pb-7.75'>
				{/* <div> */}
				<div className='flex flex-col gap-1.25 tracking-[0.6px]'>
					<h2 className='text-base sm:text-[22px] font-bold text-text-title'>{data.reviewPanelConfig.title}</h2>
					<p className='text-sm text-text-muted mt-1 leading-[130%]'>{data.reviewPanelConfig.description}</p>
				</div>
				{/* Categories Grouping */}
				<div className='flex flex-col gap-2.5'>
					{(['CAMERAS', 'SENSORS', 'ACCESSORIES', 'PLAN'] as const).map((category) => {
						const categoryItems = selectedItems.filter((i) => i.product.categoryId === category);
						if (categoryItems.length === 0) return null;

						return (
							<div key={category} className='border-t border-border-default pt-3.75'>
								<h4 className='text-[10px] text-gray-400 uppercase tracking-wider mb-2'>{category}</h4>
								<div className='space-y-3'>
									{categoryItems.map(({ product, variant, quantity, itemKey }) => (
										<div
											key={itemKey}
											className='flex items-center justify-between gap-4 text-xs transition-all duration-300 opacity-100 scale-100 starting:opacity-0 starting:scale-95'
										>
											<div className='flex items-center gap-3 flex-1'>
												<img
													src={product.image}
													alt={product.title}
													className={`${product.specialTitleWord ? 'w-5' : 'size-10.25 aspect-square rounded-[5px] bg-white object-contain'}`}
												/>
												<div className='flex items-end gap-1 text-sm text-gray-c900'>
													{/* Title takes remaining space and clamps to 2 lines max */}
													<span
														className={`line-clamp-2 flex-1 min-w-0 ${product.specialTitleWord ? '-ms-2.25' : ''}`}
													>
														{product.title} {variant?.name && ` (${variant.name})`}
														{product.specialTitleWord && (
															<span className='text-brand-primary font-bold'>{` ${product.specialTitleWord}`}</span>
														)}
													</span>
												</div>
												{!product.noQuantitySelector && (
													<div className='flex items-center justify-between rounded py-1 ms-auto'>
														<button
															type='button'
															onClick={() => updateQuantity(product.id, variant?.id, -1)}
															className='size-5 flex items-center justify-center text-gray-c700 rounded bg-white hover:bg-gray-c100 hover:border hover:border-gray-c400 '
														>
															<StepIcon name='-' className='size-2' />
														</button>
														<span className='w-8 text-center text-gray-c900 select-none'>{quantity}</span>
														<button
															type='button'
															onClick={() => updateQuantity(product.id, variant?.id, 1)}
															className='size-5 flex items-center justify-center text-gray-c700 rounded bg-white hover:bg-gray-c100 hover:border hover:border-gray-c400 '
														>
															<StepIcon name='+' className='size-2' />
														</button>
													</div>
												)}
											</div>

											<div className=''>
												{product.isFree ? (
													<div className='min-w-16 text-end'>
														<span className='block text-sm tracking-[0.5px] leading-4 text-gray-c600 line-through'>
															${((product.compareAtPrice || 0) * quantity).toFixed(2)}
															{product.unitSuffix && <span className='ms-1'>{product.unitSuffix}</span>}
														</span>
														<span className='block text-sm tracking-[0.5px] leading-4 text-brand-hover'>
															FREE
														</span>
													</div>
												) : (
													<div className='min-w-16 text-end'>
														{product.compareAtPrice && (
															<span className='block text-sm tracking-[0.5px] leading-4 text-gray-c600 line-through'>
																${(product.compareAtPrice * quantity).toFixed(2)}
																{product.unitSuffix && <span className='ms-1'>{product.unitSuffix}</span>}
															</span>
														)}
														<span className='block text-sm tracking-[0.5px] leading-4 text-brand-hover'>
															${(product.price * quantity).toFixed(2)}
															{product.unitSuffix && <span className='ms-1'>{product.unitSuffix}</span>}
														</span>
													</div>
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						);
					})}

					<div className='flex items-center justify-between gap-2 text-xs border-t border-border-default pt-3.75'>
						<div className='flex items-center gap-4 font-semibold text-gray-800'>
							<span className='size-10.25 rounded-[5px] bg-white grid place-items-center'>
								<StepIcon name='fastShipping' className='size-7.25' />
							</span>
							{data.reviewPanelConfig.shipping.title}
						</div>
						<div className='min-w-16 text-right'>
							<span className='block text-sm tracking-[0.5px] leading-4 text-gray-c600 line-through'>
								${data.reviewPanelConfig.shipping.compareAtPrice.toFixed(2)}
							</span>
							<span className='block text-sm tracking-[0.5px] leading-4 text-brand-hover'>FREE</span>
						</div>
					</div>
					{/* </div> */}

					{/* Order Summary Footer */}
					<div className='flex flex-col gap-2'>
						<div className='flex gap-4 items-center justify-between'>
							<div className='size-19.5'>
								<img src={data.reviewPanelConfig.financing.img} alt={data.reviewPanelConfig.financing.text} />
							</div>
							<div className='flex flex-col gap-2 items-end'>
								<span className='inline-block w-fit bg-brand-primary text-white text-xs tracking-[-5%] px-2 py-1.25 rounded-[3px]'>
									{data.reviewPanelConfig.financing.text}
								</span>
								<div className='flex items-baseline justify-end gap-2'>
									<span className='block text-lg leading-4 text-gray-c600 line-through'>
										${compareAtSubtotal.toFixed(2)}
									</span>
									<span className='block text-2xl font-bold leading-8 text-brand-primary'>
										${subtotal.toFixed(2)}
									</span>
								</div>
							</div>
						</div>

						<div className='flex flex-col gap-1 pt-2.5'>
							{/* Savings Message */}
							{totalSavings > 0 && (
								<p className='text-xs text-center text-green tracking-[-0.06px]'>
									Congrats! You're saving ${totalSavings.toFixed(2)} on your security bundle!
								</p>
							)}

							<button
								type='button'
								className='w-full bg-brand-primary hover:bg-brand-primary/80 text-white font-bold py-3.25 px-4 rounded transition-all text-[17px] '
							>
								{data.reviewPanelConfig.checkoutButtonText}
							</button>
						</div>

						<button
							type='button'
							// onClick={saveForLater}
							onClick={() => toast.success('Your system configuration has been saved successfully!')}
							className='w-full text-center text-xs md:text-sm leading-[120%] tracking-[-0.02px] text-text-muted2 hover:text-gray-c900 underline block '
						>
							{data.reviewPanelConfig.saveForLaterText}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
