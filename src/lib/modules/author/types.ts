export interface Author {
	name: string;
	nick: string;
	avatar?: string;
	role?: string;
	bio?: string;
	social?: {
		twitter?: string;
		instagram?: string;
		youtube?: string;
		tiktok?: string;
		github?: string;
		email?: string;
	};
}
