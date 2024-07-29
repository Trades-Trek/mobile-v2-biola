import {Types} from "mongoose";

export const useOneSignalService = () => {
    const headers = {
        Authorization: "Basic " + process.env.ONE_SIGNAL_API_KEY,
        "Content-Type": "application/json"
    };
    const sendPushNotification = async (userIds: Types.ObjectId | Array<Types.ObjectId>, title: string, description: string, payload: any) => {
        const notification = {
            app_id: process.env.ONE_SIGNAL_APP_ID,
            headings: {en: title},
            contents: {
                en: description
            },
            // android_channel_id:'80f8b0f0-1dcd-4a4f-ab2c-9708f349ffba',
            include_external_user_ids: Array.isArray(userIds) ? userIds : [userIds],
            large_icon: "https://play-lh.googleusercontent.com/W-awW3br2vog0aXhfpZ_W3h5lIY-o8EJECchVtyM5vRebx9vSTY3I6E2YvHgNp3ShPQ=w480-h960-rw",
            big_picture: "https://www.bigpicture.com",
            data: {payload}
        };
        try {
            await axios.post("https://onesignal.com/api/v1/notifications", notification, {headers});
        } catch (e) {
            console.log(e)
        }
    }

    return {sendPushNotification}
}