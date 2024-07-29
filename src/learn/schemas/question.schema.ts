import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema({_id:false, versionKey:false})
export class Question {
    @Prop({required: true})
    text:string

    @Prop({required: true})
    description:string

    @Prop({required: true})
    question_type:string

    @Prop({required: true})
    correct_answer:string

    @Prop({type: [String], required: true})
    options:[string]

}

export const QuestionSchema = SchemaFactory.createForClass(Question);