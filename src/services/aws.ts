import * as aws from "@aws-sdk/client-ses";
let { defaultProvider } = require("@aws-sdk/credential-provider-node");

export const useAwsServices = () => {
    const ses = new aws.SES({
        apiVersion: "2010-12-01",
        region: "us-east-1", // Your region will need to be updated
        credentials: {
            accessKeyId: process.env.AWS_SES_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SES_SECRET_KEY,
        },
    });
    return {ses}
}