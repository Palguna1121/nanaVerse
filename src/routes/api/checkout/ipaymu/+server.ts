import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import * as ipaymu from 'ipaymu-nodejs-api';
import { PUBLIC_IPAYMU_VA, PUBLIC_IPAYMU_API_KEY } from '$env/static/public';

export async function POST({ request, url }: RequestEvent) {
	try {
		const body = await request.json();
		const { mode, carts, userData } = body;

		// Inisialisasi kredensial iPaymu
		ipaymu.setVa(PUBLIC_IPAYMU_VA);
		ipaymu.setApiKey(PUBLIC_IPAYMU_API_KEY);
		ipaymu.setProd(false); // Sandbox mode

		// Pastikan URL valid
		const baseUrl = url.origin;
		const notifyUrl = `${baseUrl}/api/payment/callback/ipaymu`;

		ipaymu.setURL({
			ureturn: `${baseUrl}/checkout/success`,
			ucancel: `${baseUrl}/checkout`,
			unotify: notifyUrl
		});

		// Set keranjang belanja (ipaymu-nodejs-api menggunakan method addCart)
		// Note: Package ini mungkin memodifikasi state global, pastikan carts adalah object array.
		if (carts) {
			ipaymu.addCart(carts);
		}

		let result;

		// Call iPaymu API
		if (mode === 'direct') {
			result = await ipaymu.directPayment(userData);
		} else {
			result = await ipaymu.redirectPayment(userData);
		}

		return json({ success: true, data: result });
	} catch (error: any) {
		console.error('iPaymu Error:', error);
		return json(
			{ success: false, message: error.message || 'Payment gateway integration failed' },
			{ status: 500 }
		);
	}
}
