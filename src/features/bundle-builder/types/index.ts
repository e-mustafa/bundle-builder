export interface Variant {
	id: string;
	name: string;
	hexColor?: string;
	thumbnailUrl?: string;
	initialQuantity: number;
	img: string;
}

export interface DiscountBadge {
	text: string;
	type: 'discount' | 'required' | 'promo';
}

export interface Product {
	id: string;
	title: string;
	description: string;
	categoryId: 'CAMERAS' | 'SENSORS' | 'ACCESSORIES' | 'PLAN';
	learnMoreUrl?: string;
	image: string;
	price: number;
	compareAtPrice?: number;
	unitSuffix?: string;
	badge?: DiscountBadge;
	hasVariants: boolean;
	defaultVariantId?: string;
	variants?: Variant[];
	initialQuantity?: number;
	isFree?: boolean;

	specialTitleWord?: string;
	noQuantitySelector?: boolean;
}

export interface Step {
	id: string;
	stepNumber: number;
	totalSteps: number;
	title: string;
	iconName: string;
	icon?: string;
	nextButtonText: string;
	products: Product[];
}

export interface ReviewPanelConfig {
	title: string;
	description: string;
	shipping: {
		title: string;
		price: number;
		compareAtPrice: number;
		isFree: boolean;
	};
	satisfactionGuarantee: {
		badgeText: string;
		description: string;
	};
	financing: {
		text: string;
		img: string;
	};
	checkoutButtonText: string;
	saveForLaterText: string;
}

export interface BundleBuilderData {
	steps: Step[];
	reviewPanelConfig: ReviewPanelConfig;
}
