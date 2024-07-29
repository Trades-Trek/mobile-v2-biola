import {Process, Processor} from "@nestjs/bull";
import {Job} from "bull";
import {HttpException, HttpStatus} from "@nestjs/common";
import {useNodemailerServices} from "../../services/nodemailer";

const useNodemailer = useNodemailerServices()

@Processor('email-queue')
export class EmailProcessor {
    @Process('sendEmail')
    async sendMailProcessor(job: Job) {
        try {
            const context = job.data.data.context ? job.data.data.context : null
            const data = {
                from: `Traes Trek info@tradestrek.com`,
                to: job.data.data.to,
                subject: job.data.data.subject,
                template: job.data.data.template,
                cc: job.data.data.cc,
                bcc: job.data.data.bcc,
                context
            }
            await useNodemailer.sendMail(data)
            //
        } catch (e) {
            console.log(e)
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}