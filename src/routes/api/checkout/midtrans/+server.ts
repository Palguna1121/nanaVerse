import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import midtransClient from 'midtrans-client';
import { env } from '$env/dynamic/public';

// SvelteKit Vite dev server runs in Node, but we use Midtrans Node client.
// Note: Midtrans Server Key should ideally be a secret environment variable,
// but we use PUBLIC_ for demo consistency as set up by the user.

export async function POST({ request, url }: RequestEvent) {
    try {
        const body = await request.json();
        const { mode, carts, userData } = body;

        const orderId = `NANA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const grossAmount = parseInt(userData.amount);

        // Map carts to Midtrans items
        const itemDetails = carts.product.map((name: string, index: number) => ({
            id: `ITEM-${index}`,
            price: parseInt(carts.price[index]),
            quantity: parseInt(carts.quantity[index]),
            name: name
        }));

        const customerDetails = {
            first_name: userData.buyerName || userData.name,
            email: userData.buyerEmail || userData.email,
            phone: userData.buyerPhone || userData.phone,
        };

        if (mode === 'redirect') {
            // Menggunakan Snap API untuk mode redirect
            const snap = new midtransClient.Snap({
                isProduction: false,
                serverKey: env.PUBLIC_MIDTRANS_SERVER_KEY
            });

            const parameter = {
                transaction_details: {
                    order_id: orderId,
                    gross_amount: grossAmount
                },
                item_details: itemDetails,
                customer_details: customerDetails
            };

            const transaction = await snap.createTransaction(parameter);
            
            return json({
                success: true,
                data: {
                    Data: {
                        Url: transaction.redirect_url,
                        Token: transaction.token
                    }
                }
            });

        } else {
            // Mode Direct menggunakan CoreApi agar mirip iPaymu (halaman sendiri)
            const coreApi = new midtransClient.CoreApi({
                isProduction: false,
                serverKey: env.PUBLIC_MIDTRANS_SERVER_KEY
            });

            let paymentType = '';
            let chargeParams: any = {
                transaction_details: {
                    order_id: orderId,
                    gross_amount: grossAmount
                },
                item_details: itemDetails,
                customer_details: customerDetails
            };

            // Mapping dari metode kita ke format Midtrans Core API
            const reqMethod = userData.paymentMethod;
            const reqChannel = userData.paymentChannel;

            if (reqMethod === 'qris') {
                paymentType = 'gopay'; // Untuk testing QRIS Midtrans sandbox, gopay mengembalikan QR
            } else if (reqMethod === 'va') {
                paymentType = 'bank_transfer';
                chargeParams.bank_transfer = {
                    bank: reqChannel === 'mandiri' ? 'mandiri' : 'bca'
                };
                if (reqChannel === 'mandiri') {
                    chargeParams.echannel = {
                        bill_info1: "Payment For:",
                        bill_info2: "NanaVerse"
                    };
                    paymentType = 'echannel'; // Mandiri bill menggunakan echannel
                }
            } else if (reqMethod === 'cstore') {
                paymentType = 'cstore';
                chargeParams.cstore = {
                    store: 'alfamart',
                    message: 'NanaVerse Order'
                };
            } else {
                paymentType = 'bank_transfer';
                chargeParams.bank_transfer = { bank: 'bca' };
            }

            chargeParams.payment_type = paymentType;

            const response = await coreApi.charge(chargeParams);
            
            let paymentNo = '';
            let qrString = '';

            if (response.payment_type === 'bank_transfer') {
                paymentNo = response.va_numbers?.[0]?.va_number || '';
            } else if (response.payment_type === 'echannel') {
                paymentNo = response.bill_key || ''; // Mandiri bill key
            } else if (response.payment_type === 'cstore') {
                paymentNo = response.payment_code || '';
            } else if (response.payment_type === 'gopay') {
                // Gopay/QRIS mengembalikan array actions
                const qrAction = response.actions?.find((a: any) => a.name === 'generate-qr-code');
                qrString = qrAction?.url || '';
            }

            return json({
                success: true,
                data: {
                    Data: {
                        PaymentNo: paymentNo,
                        QrString: qrString,
                        TransactionId: response.transaction_id,
                        OriginalResponse: response
                    }
                }
            });
        }
    } catch (error: any) {
        console.error('❌ [Midtrans API Error]:', error);
        return json({ success: false, message: error.message }, { status: 500 });
    }
}
