import {Prop, raw, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";
import {Question, QuestionSchema} from "./question.schema";

@Schema({timestamps: true})
export class Quiz {
    @Prop({required: true})
    title: string

    @Prop({required: true, type: Types.ObjectId})
    learn_resource_id: Types.ObjectId

    @Prop({required: true})
    description: string

    @Prop({
        type: [QuestionSchema], required:true
    })
    questions: Question[]

}

export const QuizSchema = SchemaFactory.createForClass(Quiz);