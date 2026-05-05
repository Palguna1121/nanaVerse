declare module 'midtrans-client' {
    interface TransactionResult {
        token: string;
        redirect_url: string;
    }

    interface ChargeResult {
        status_code: string;
        transaction_id: string;
        order_id: string;
        payment_type: string;
        transaction_status: string;
        gross_amount: string;
        currency: string;
        va_numbers?: Array<{ bank: string; va_number: string }>;
        bill_key?: string;
        biller_code?: string;
        payment_code?: string;
        actions?: Array<{ name: string; method: string; url: string }>;
        qr_string?: string;
        [key: string]: any;
    }

    interface NotificationResult {
        order_id: string;
        transaction_status: string;
        fraud_status: string;
        payment_type: string;
        transaction_id: string;
        [key: string]: any;
    }

    interface ClientOptions {
        isProduction: boolean;
        serverKey: string;
        clientKey?: string;
    }

    class Snap {
        constructor(options: ClientOptions);
        createTransaction(parameter: object): Promise<TransactionResult>;
        createTransactionToken(parameter: object): Promise<string>;
        createTransactionRedirectUrl(parameter: object): Promise<string>;
    }

    class CoreApi {
        constructor(options: ClientOptions);
        charge(parameter: object): Promise<ChargeResult>;
        transaction: {
            notification(notificationBody: object): Promise<NotificationResult>;
            status(transactionId: string): Promise<ChargeResult>;
        };
    }

    export { Snap, CoreApi };
}
