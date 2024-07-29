import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import {SendEmailDto} from "./dto/email.dto";

@Injectable()
export class QueueService {
  constructor(@InjectQueue("email-queue") private emailQueue: Queue) {
  }

  async sendEmail(data:SendEmailDto) {
    await this.emailQueue.add("sendEmail", {
      data: data
    });
  }


}
