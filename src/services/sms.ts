const axios = require("axios");
const useSmsService = () => {
    const useSendCharmHeader = () => {
        const APIKEY = process.env.SEND_CHARM_API_KEY;
        const Bearer = `Bearer ${APIKEY}`;
        return {
            Authorization: Bearer,
            "content-type": "application/json"
        };
    }
    const sendCharm = async (to: string | string[], message: string) => {
        try {
            const options = {
                headers: useSendCharmHeader()
            };
            const body = {
                to,
                message,
                sender_name: "Trades Trek",
                route: "dnd"

            };
            await axios.post("https://api.sendchamp.com/api/v1/sms/send", body, options);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }

    }
    return {sendCharm}
}