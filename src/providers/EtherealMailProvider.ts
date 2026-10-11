import nodemailer from 'nodemailer'
import { getMailClient } from "../lib/mail";
import logger from '../lib/logger';
import { ImailProvider } from './IMailProvider';

export class EtherealMailProvider implements ImailProvider {
    async sendMail(to: string, subject: string, text: string, html: string) {
        const mailer = await getMailClient();
        const info = await mailer.sendMail({
            from: '"DevStore" <noreply@devstore.com>',
            to: to,
            subject: subject,
            text: text,
            html: html
        });
        const previewUrl = nodemailer.getTestMessageUrl(info);
        logger.info(`Email  enviado: ${previewUrl}`);
        return previewUrl;  
    }
}