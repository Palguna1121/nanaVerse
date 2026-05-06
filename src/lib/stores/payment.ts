import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type PaymentMethod = 'xepeng' | 'ipaymu' | 'doku' | 'midtrans' | 'xendit';
export type PaymentMode = 'direct' | 'redirect';

export interface PaymentGateway {
	id: PaymentMethod;
	uuid: string;
	name: string;
	enabled: boolean;
	mode: PaymentMode;
	allowModeSwitch: boolean;
	description: string;
}

const defaultGateways: PaymentGateway[] = [
	{
		id: 'xepeng',
		uuid: '286e6896-1804-4113-9366-419b48f68285',
		name: 'Xepeng',
		enabled: false,
		mode: 'redirect',
		allowModeSwitch: false,
		description: 'Crypto Payment Gateway'
	},
	{
		id: 'ipaymu',
		uuid: 'f9b5c760-4929-4504-9844-332308670f5e',
		name: 'iPaymu',
		enabled: true,
		mode: 'redirect',
		allowModeSwitch: true,
		description: 'Direct Payment & Redirect'
	}
	// { id: 'midtrans', uuid: '9a8a8163-5967-4286-905c-358046b40e3a', name: 'Midtrans', enabled: false, mode: 'redirect', allowModeSwitch: true, description: 'Versatile Payment Gateway' },
	// { id: 'doku', uuid: 'e3362141-8f43-4c55-b829-44d47f98e5e7', name: 'DoKu', enabled: false, mode: 'redirect', allowModeSwitch: true, description: 'Southeast Asia Payment Leader' },
	// { id: 'xendit', uuid: '19808e0a-0104-46c5-8495-207a974b8686', name: 'Xendit', enabled: false, mode: 'redirect', allowModeSwitch: true, description: 'Modern Payment Infrastructure' }
];

const getInitialGateways = () => {
	if (!browser) return defaultGateways;
	try {
		const stored = localStorage.getItem('payment_gateways');
		if (stored) {
			const parsed = JSON.parse(stored);
			if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].uuid) {
				// Filter agar hanya ipaymu dan xepeng yang muncul (mudah dikomentari jika ingin mengaktifkan lainnya)
				const validIds = ['ipaymu', 'xepeng' /*, 'midtrans', 'doku', 'xendit' */];
				return parsed.filter((pg: any) => validIds.includes(pg.id));
			}
		}
	} catch (e) {
		// ignore
	}
	return defaultGateways;
};

const initialGateways = getInitialGateways();

export const paymentGateways = writable<PaymentGateway[]>(initialGateways);

if (browser) {
	paymentGateways.subscribe((value) => {
		localStorage.setItem('payment_gateways', JSON.stringify(value));
	});
}

// Store for the currently active/selected gateway during checkout
const getInitialActive = () => {
	if (!browser) return 'ipaymu';
	const stored = localStorage.getItem('active_gateway');

	// Jika Xepeng tapi SSO tidak terhubung, fallback ke ipaymu
	const isXepengConnected = !!localStorage.getItem('oauth_tokens');
	if (stored && stored !== 'xepeng') return stored as PaymentMethod;
	if (stored === 'xepeng' && isXepengConnected) return 'xepeng';

	// Jika xepeng belum connected, cari yang enabled bukan xepeng
	const enabled = initialGateways.find((g) => g.enabled && g.id !== 'xepeng');
	if (enabled) return enabled.id;

	return 'ipaymu';
};

export const activeGatewayId = writable<PaymentMethod>(getInitialActive());

if (browser) {
	activeGatewayId.subscribe((value) => {
		localStorage.setItem('active_gateway', value);
	});
}
