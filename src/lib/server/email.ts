import { dev } from '$app/environment';
import { EMAIL_API_TOKEN } from '$env/static/private';
import config from '$lib/config';
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
		from: config.email.smtpFrom,
		to: to,
		subject: subject,
		html,
		reply_to: config.email.replyTo
	};

	return emailClient.emails.send(options).catch((e) => {
		console.error(e);
	});
};
