export class SendEmailDto {
    to: string;
    subject: string;
    context?: object;
    template: string;
    bcc?: string;
    cc?: string;

}