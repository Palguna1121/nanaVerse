import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import midtransClient from 'midtrans-client';
import { env } from '$env/dynamic/public';

export async function POST({ request }: RequestEvent) {
    try {
        const body = await request.json();
        
        console.log('🔔 [Midtrans Callback Received]:', body);

        // Inisialisasi CoreApi untuk verifikasi (opsional, tapi disarankan)
        const coreApi = new midtransClient.CoreApi({
            isProduction: false,
            serverKey: env.PUBLIC_MIDTRANS_SERVER_KEY
        });

        const statusResponse = await coreApi.transaction.notification(body);

        let orderId = statusResponse.order_id;
        let transactionStatus = statusResponse.transaction_status;
        let fraudStatus = statusResponse.fraud_status;

        console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

        // TODO: Update status transaksi di database berdasarkan transactionStatus
        // (settlement, capture, pending, cancel, deny, expire)

        return new Response('OK', { status: 200 });
    } catch (error: any) {
        console.error('❌ [Midtrans Callback Error]:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
