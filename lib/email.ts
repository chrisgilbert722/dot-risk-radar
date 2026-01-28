import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_FROM = 'DOT Risk Radar <alerts@notifications.dotriskradar.com>'; // Update with verified domain
