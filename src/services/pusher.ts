const Pusher = require("pusher");

const usePusherServices = () => {

    const dispatchEvent = async (channel, event, payload) => {
        const config = {
            appId: process.env.PUSHER_APP_ID,
            key: process.env.PUSHER_KEY,
            secret: process.env.PUSHER_SECRET,
            cluster: 'eu',
            useTLS: true
        }
        const pusher = new Pusher(config);
        try {
            await pusher.trigger(channel, event, payload)
        } catch (e) {
            console.log(e)
        }
        return true;
    }
    return {dispatchEvent}
};

export default usePusherServices()
