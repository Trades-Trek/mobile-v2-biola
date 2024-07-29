import {forwardRef, Global, Module} from "@nestjs/common";
import {BullModule} from "@nestjs/bull";
import {EmailProcessor} from "./processors/email.processor";
import {QueueService} from "./queue.service";

@Global()
@Module({
    imports: [
        BullModule.registerQueue({
            name: "email-queue"
        })
    ],
    providers: [QueueService, EmailProcessor],
    exports: [BullModule, QueueService]
})
export class QueueModule {
}