import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {COMPETITION_TYPE} from "../../enums/competition.enum";
import {Document, Types} from "mongoose";

export type ParticipantDocument = Participant & Document;

@Schema({timestamps: true})
export class Participant {
    @Prop({
        required: false, type: Types.ObjectId,
        ref: 'User'
    })
    participant: Types.ObjectId

    @Prop({required: false})
    email: string

    @Prop({required: false, default: false})
    is_owner: boolean

    @Prop({required: false, default: 0})
    points: number

    @Prop({required: false, default:0})
    starting_cash: number

    @Prop({
        type: Types.ObjectId,
        ref: 'Competition',
        required: true,
    })
    competition: Types.ObjectId

    @Prop({required: true, default: false})
    joined: boolean

    @Prop({required: true, default: true})
    invited: boolean

}

export const ParticipantSchema = SchemaFactory.createForClass(Participant)
