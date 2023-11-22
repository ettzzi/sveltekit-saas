// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	/// <reference types="stripe-event-types" />
	namespace App {
		// interface Error {}
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
		interface PageData {
			user?: User;
		}
		// interface Platform {}
	}

	/// <reference types="lucia" />
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {
			email: string;
			email_verified: boolean;
			name: string;
		};
		type DatabaseSessionAttributes = {};
	}
}

export {};
