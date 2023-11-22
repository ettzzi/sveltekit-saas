import { dev } from '$app/environment';
import { EMAIL_API_TOKEN } from '$env/static/private';
import { PUBLIC_EMAIL_REPLY_TO, PUBLIC_EMAIL_SMTP_FROM } from '$env/static/public';
import { Resend } from 'resend';

const emailClient = new Resend(EMAIL_API_TOKEN);

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
		from: PUBLIC_EMAIL_SMTP_FROM,
		to: to,
		subject: subject,
		html,
		reply_to: PUBLIC_EMAIL_REPLY_TO
	};

	return emailClient.emails.send(options).catch((e) => {
		console.error(e);
	});
};
