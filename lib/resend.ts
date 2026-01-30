import { Resend } from 'resend';

export const resend = new Resend(process.env.RES_API_KEY || 're_missing');

if (!process.env.RES_API_KEY) {
    console.warn('RES_API_KEY is missing. Emails will not be sent.');
}
