import { dev } from '$app/environment';
import { SMTP_FROM, EMAIL_API_TOKEN } from '$env/static/private';
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
		from: SMTP_FROM,
		to: to,
		subject: subject,
		html
	};

	return emailClient.emails.send(options).catch((e) => {
		console.error(e);
	});
};
