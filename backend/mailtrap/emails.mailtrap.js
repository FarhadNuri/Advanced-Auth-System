import { client,sender } from './config.mailtrap.js';
import { VERIFICATION_EMAIL_TEMPLATE } from './emailTemplate.js';

export async function sendVerificationEmail(email, verificationToken) {
    const recipient = [{ email}];

    try {
        const response = await client.send({
            from: sender,
            to: recipient,
            subject: 'Verify your email address',
            html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken),
            category: 'Verification Emails',
        });
        console.log('Verification email sent:', response);
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
}