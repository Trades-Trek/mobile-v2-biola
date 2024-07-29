import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";

@Schema({timestamps: true})
export class QuizzesTaken {
    @Prop({required: true, type: Types.ObjectId, ref: 'User'})
    user: Types.ObjectId

    @Prop({required: true, type: Types.ObjectId})
    quiz_id: Types.ObjectId

    @Prop({required: true, type: Number})
    score: number

    @Prop({required: true, type: Date})
    taken_at: Date

    @Prop({type: [{question: {type: String, required: true}, answer: {type: String, required: true}}]})
    answers: { question: { type: String, required: true }, answer: { type: String, required: true } }[]

}

export const QuizzesTakenSchema = SchemaFactory.createForClass(QuizzesTaken);