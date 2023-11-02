import { dev } from '$app/environment';
import { SMTP_FROM, POSTMARK_API_TOKEN } from '$env/static/private';

import { Client } from 'postmark';
const postmarkClient = new Client(POSTMARK_API_TOKEN);

export const sendEmail = async ({
	to,
	subject,
	html
}: {
	to: string;
	subject: string;
	html: string;
}) => {
	if (dev) {
		console.log('Sending email:', { to, subject, html });
		return;
	}

	const options = {
		From: SMTP_FROM,
		To: to,
		Subject: subject,
		HtmlBody: html
	};

	const result = await postmarkClient.sendEmail(options);

	if (result.ErrorCode) {
		throw new Error(result.Message);
	}
};
