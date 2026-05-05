// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

// Module declarations for packages without type definitions
declare module 'midtrans-client' {
	interface ClientOptions {
		isProduction: boolean;
		serverKey: string;
		clientKey?: string;
	}
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
		va_numbers?: Array<{ bank: string; va_number: string }>;
		bill_key?: string;
		payment_code?: string;
		actions?: Array<{ name: string; method: string; url: string }>;
		[key: string]: any;
	}
	interface NotificationResult {
		order_id: string;
		transaction_status: string;
		fraud_status: string;
		[key: string]: any;
	}
	class Snap {
		constructor(options: ClientOptions);
		createTransaction(parameter: object): Promise<TransactionResult>;
	}
	class CoreApi {
		constructor(options: ClientOptions);
		charge(parameter: object): Promise<ChargeResult>;
		transaction: {
			notification(body: object): Promise<NotificationResult>;
			status(id: string): Promise<ChargeResult>;
		};
	}
	export { Snap, CoreApi };
}

export {};
