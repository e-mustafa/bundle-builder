import { useEffect } from 'react';
import { cn } from '../../shared/utils';
import ProductCard from './components/ProductCard';
import ReviewPanel from './components/ReviewPanel';
import StepIcon from './components/StepIcon';
import { useBundleStore } from './stores/useBundleStore';
import type { BundleBuilderData } from './types';
import { calculateStepSelectedCount } from './utils/bundle';

interface BundleBuilderProps {
	initialData: BundleBuilderData;
}

export default function BundleBuilder({ initialData }: BundleBuilderProps) {
	const { activeStepId, setActiveStepId, quantities, initializeDefaults } = useBundleStore();

	// Hydrate store defaults on initial mount
	useEffect(() => {
		initializeDefaults(initialData);
	}, [initialData, initializeDefaults]);

	return (
		<section className='container py-8 min-h-screen'>
			<h1 className='md:hidden text-[31.88px] font-bold text-center text-text-title pb-5 px-5.25'>Let’s get started!</h1>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-7.25 items-start'>
				{/* Left Column: Accordion Step Builder */}
				<div className='lg:col-span-2'>
					{/* Accordion Steps List */}
					{initialData.steps.map((step, index) => {
						const isOpen = activeStepId === step.id;
						const isLastStep = index === initialData.steps.length - 1;
						const nextStep = initialData.steps[index + 1];

						// Compute total selected unique products for this step
						const selectedCount = calculateStepSelectedCount(step.products, quantities);

						return (
							<div
								key={step.id}
								className={cn(
									'flex flex-col rounded-[10px] pt-3.75 gap-1.25 transition-all duration-300',
									isOpen ? 'bg-surface-card' : 'bg-transparent',
								)}
							>
								<div className='flex items-center text-xs tracking-[1.6px] text-text-muted2 uppercase px-3.75 pb-1.25'>
									STEP {step.stepNumber} OF {step.totalSteps}
								</div>

								<div
									className={cn(
										'border-t border-text-title py-5 px-3.75 flex flex-col overflow-hidden transition-all',
										isOpen ? '' : 'border-b',
									)}
								>
									{/* Accordion Header Button */}
									<button
										type='button'
										id={`step-header-${step.id}`}
										aria-expanded={isOpen}
										aria-controls={`step-panel-${step.id}`}
										onClick={() => setActiveStepId(isOpen ? '' : step.id)}
										className='w-full flex items-center justify-between gap-2 hover:bg-surface-subtle transition-colors text-start'
									>
										<div className='flex items-center gap-2'>
											<StepIcon
												name={step.iconName}
												className='size-6.5 shrink-0 transition-colors text-gray-c600'
											/>
											<h2 className='text-text-main text-base sm:text-[22px] font-semibold tracking-tight'>
												{step.title}
											</h2>
										</div>

										{/* Right: Selected Count Badge + Animated Arrow Icon */}
										<div className='flex items-center gap-1 text-brand-primary'>
											{selectedCount > 0 && <span className='text-sm'>{selectedCount} selected</span>}
											<StepIcon
												name='arrowUp'
												className={cn('size-3 transition-transform duration-200', isOpen ? 'rotate-180' : '')}
											/>
										</div>
									</button>

									{/* Expanded Step Body */}
									<div
										id={`step-panel-${step.id}`}
										role='region'
										aria-labelledby={`step-header-${step.id}`}
										className={cn('accordion-wrapper', isOpen ? 'accordion-open' : 'accordion-closed')}
									>
										<div className='overflow-hidden'>
											<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-3.75'>
												{step.products.map((product) => (
													<div
														key={product.id}
														className='w-full pt-3.75 lg:last:odd:col-span-2 lg:last:odd:justify-self-center lg:last:odd:w-[calc(50%-7.5px)]'
													>
														<ProductCard product={product} />
													</div>
												))}
											</div>

											{/* Next Step Navigation Button */}
											{!isLastStep && nextStep && (
												<div className='pt-3.75 text-center'>
													<button
														type='button'
														onClick={() => setActiveStepId(nextStep.id)}
														className='btn-outline'
													>
														{step.nextButtonText}
													</button>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{/* Right Column: Live Review Panel */}
				<div className='sticky top-8'>
					<ReviewPanel data={initialData} />
				</div>
			</div>
		</section>
	);
}
