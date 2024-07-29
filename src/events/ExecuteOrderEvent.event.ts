import {Types} from "mongoose";
import {UserDocument} from "../users/schemas/user.schema";

export class ExecuteOrderEvent {
    constructor(public readonly orderId: Types.ObjectId, public readonly user: UserDocument | Types.ObjectId) {
    }
}