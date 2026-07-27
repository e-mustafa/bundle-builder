import type { Product } from '../types';

export const getItemKey = (productId: string, variantId?: string): string => {
	return variantId ? `${productId}__${variantId}` : productId;
};

// Helper function to calculate selected product counts for a single step
export const calculateStepSelectedCount = (products: Product[], quantities: Record<string, number>): number => {
	return products.reduce((acc, p) => {
		if (p.hasVariants && p.variants) {
			const hasSelectedVariant = p.variants.some((v) => (quantities[getItemKey(p.id, v.id)] || 0) > 0);
			return acc + (hasSelectedVariant ? 1 : 0);
		}
		return acc + ((quantities[getItemKey(p.id)] || 0) > 0 ? 1 : 0);
	}, 0);
};