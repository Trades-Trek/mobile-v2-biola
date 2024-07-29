import development from "./development";
import production from "./production";
import staging from "./staging";
import client from "./client";
import {Exchange} from "../stock/entities/exchange.entity";
import {User, UserSchema} from "../users/schemas/user.schema";
export default async ()  => ({
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    ROLLBAR_TOKEN:process.env.ROLLBAR_TOKEN,
    PORT: parseInt(process.env.PORT, 10) || 3000,
    ...process.env.NODE_ENV === 'development' ? development() : process.env.NODE_ENV === 'staging' ? staging() : production(),
    ENCRYPTION_SECRET_KEY:process.env.ENCRYPTION_SECRET_KEY,
    ...client(),

});


