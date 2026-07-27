import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { BundleBuilderData } from '../types';
import { getItemKey } from '../utils/bundle';

interface BundleStoreState {
	activeStepId: string;
	quantities: Record<string, number>;
	activeVariants: Record<string, string>;
	// saveNotification: string | null;

	// Actions
	setActiveStepId: (stepId: string) => void;
	setActiveVariant: (productId: string, variantId: string) => void;
	updateQuantity: (productId: string, variantId: string | undefined, delta: number) => void;
	// saveForLater: () => void;
	initializeDefaults: (data: BundleBuilderData) => void;
}

const STORAGE_KEY = 'wyze_bundle_builder_saved_state';

export const useBundleStore = create<BundleStoreState>()(
	persist(
		(set, get) => ({
			activeStepId: 'cameras-step',
			quantities: {},
			activeVariants: {},
			// saveNotification: null,

			setActiveStepId: (stepId: string) => {
				set({ activeStepId: stepId });
			},

			setActiveVariant: (productId: string, variantId: string) => {
				set((state) => ({
					activeVariants: { ...state.activeVariants, [productId]: variantId },
				}));
			},

			updateQuantity: (productId: string, variantId: string | undefined, delta: number) => {
				const key = getItemKey(productId, variantId);
				set((state) => {
					const current = state.quantities[key] || 0;
					const next = Math.max(0, current + delta);
					return {
						quantities: { ...state.quantities, [key]: next },
					};
				});
			},

			// saveForLater: () => {
			// 	set({ saveNotification: 'Your system configuration has been saved successfully!' });
			// 	setTimeout(() => set({ saveNotification: null }), 3000);
			// },

			initializeDefaults: (data: BundleBuilderData) => {
				const state = get();

				// Only set defaults if state is currently uninitialized
				const hasQuantities = Object.keys(state.quantities).length > 0;
				if (hasQuantities) return;

				const defaultVariants: Record<string, string> = {};
				const defaultQuantities: Record<string, number> = {};

				data.steps.forEach((step) => {
					step.products.forEach((p) => {
						if (p.hasVariants && p.defaultVariantId) {
							defaultVariants[p.id] = p.defaultVariantId;
						}

						if (p.hasVariants && p.variants) {
							p.variants.forEach((v) => {
								defaultQuantities[getItemKey(p.id, v.id)] = v.initialQuantity;
							});
						} else {
							defaultQuantities[getItemKey(p.id)] = p.initialQuantity || 0;
						}
					});
				});

				set({
					activeVariants: defaultVariants,
					quantities: defaultQuantities,
				});
			},
		}),
		{
			name: STORAGE_KEY,
			storage: createJSONStorage(() => localStorage),
			// Only persist quantities and activeVariants
			partialize: (state) => ({
				quantities: state.quantities,
				activeVariants: state.activeVariants,
			}),
		},
	),
);
