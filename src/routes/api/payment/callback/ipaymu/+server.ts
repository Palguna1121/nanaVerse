import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request }: RequestEvent) {
    try {
        // iPaymu biasanya mengirim notifikasi via application/x-www-form-urlencoded
        const data = await request.formData();
        const body = Object.fromEntries(data);

        console.log('🔔 [iPaymu Callback Received]:', body);

        // TODO: Validasi signature callback iPaymu dan perbarui status transaksi di database
        // const status = body.status;
        // const trxId = body.trx_id;

        // iPaymu mewajibkan response HTTP 200 OK
        return new Response('OK', { status: 200 });
    } catch (error: any) {
        console.error('❌ [iPaymu Callback Error]:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
