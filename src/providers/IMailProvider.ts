export interface ImailProvider {
    sendMail(to: string, subject: string, text: string, html: string): Promise<string | false>;
}