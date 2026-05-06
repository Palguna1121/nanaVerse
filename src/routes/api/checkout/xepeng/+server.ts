import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { XepengIntegrationClient } from 'xepeng-oauth-js/integration';

export async function POST({ request, url }: RequestEvent) {
	try {
		const body = await request.json();
		const { carts, ssoClientId, ssoClientSecret } = body;

		if (!ssoClientId || !ssoClientSecret) {
			return json(
				{
					success: false,
					message: 'Xepeng SSO credentials missing. Please reconnect your Xepeng account.'
				},
				{ status: 401 }
			);
		}

		// Init dengan credentials dari SSO token response
		const client = new XepengIntegrationClient({
			clientId: ssoClientId,
			clientSecret: ssoClientSecret,
			isProduction: false
		});

		const items = carts.product.map((name: string, index: number) => ({
			amount: parseInt(carts.price[index]) * parseInt(carts.quantity[index]),
			notes: 'NanaVerse Order',
			product_description: carts.description[index] || name,
			product_name: name
		}));

		const orderResponse = await client.orders().create(items);

		const orderUid = orderResponse.item?.uid || orderResponse.data?.uid;

		if (!orderUid) {
			console.error('Order Response Error:', orderResponse);
			throw new Error('Failed to create order, no UID returned.');
		}

		// Aktifkan order sebelum membuat payment link
		await client.orders().update(orderUid, items, 'active');

		const baseUrl = url.origin;

		const paymentResponse = await client.paymentLinks().generate(orderUid, {
			expired_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
			callback_url: `${baseUrl}/api/payment/callback/xepeng`,
			success_url: `${baseUrl}/checkout/success`,
			cancel_url: `${baseUrl}/checkout/cancel`
		});

		const paymentUrl = paymentResponse.item?.payment_url || paymentResponse.data?.payment_url;

		if (!paymentUrl) {
			console.error('Payment Response Error:', paymentResponse);
			throw new Error('Failed to generate payment link.');
		}

		return json({
			success: true,
			data: {
				payment_url: paymentUrl
			}
		});
	} catch (error: any) {
		console.error('❌ [Xepeng API Error]:', error);
		return json(
			{ success: false, message: error.message || 'Payment processing failed' },
			{ status: 500 }
		);
	}
}
