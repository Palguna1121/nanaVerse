import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type PaymentMethod = 'xepeng' | 'ipaymu' | 'doku' | 'midtrans' | 'xendit';
export type PaymentMode = 'direct' | 'redirect';

export interface PaymentGateway {
    id: PaymentMethod;
    name: string;
    enabled: boolean;
    mode: PaymentMode;
    allowModeSwitch: boolean;
    description: string;
}

const defaultGateways: PaymentGateway[] = [
    { id: 'xepeng', name: 'Xepeng', enabled: true, mode: 'redirect', allowModeSwitch: false, description: 'Crypto Payment Gateway' },
    { id: 'ipaymu', name: 'iPaymu', enabled: false, mode: 'redirect', allowModeSwitch: true, description: 'Direct Payment & Redirect' },
    { id: 'doku', name: 'DoKu', enabled: false, mode: 'redirect', allowModeSwitch: true, description: 'Southeast Asia Payment Leader' },
    { id: 'midtrans', name: 'MidTrans', enabled: false, mode: 'redirect', allowModeSwitch: true, description: 'Versatile Payment Gateway' },
    { id: 'xendit', name: 'Xendit', enabled: false, mode: 'redirect', allowModeSwitch: true, description: 'Modern Payment Infrastructure' }
];

const getInitialGateways = () => {
    if (!browser) return defaultGateways;
    try {
        const stored = localStorage.getItem('payment_gateways');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {
        // ignore
    }
    return defaultGateways;
};

const initialGateways = getInitialGateways();

export const paymentGateways = writable<PaymentGateway[]>(initialGateways);

if (browser) {
    paymentGateways.subscribe(value => {
        localStorage.setItem('payment_gateways', JSON.stringify(value));
    });
}

// Store for the currently active/selected gateway during checkout
const initialActive = browser && localStorage.getItem('active_gateway') 
    ? localStorage.getItem('active_gateway') as PaymentMethod 
    : 'xepeng';

export const activeGatewayId = writable<PaymentMethod>(initialActive);

if (browser) {
    activeGatewayId.subscribe(value => {
        localStorage.setItem('active_gateway', value);
    });
}
