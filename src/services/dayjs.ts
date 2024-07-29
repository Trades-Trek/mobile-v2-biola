const dayjs = require("dayjs");
dayjs().format();
const useDayJs = () => {
    const getDate = (date?: string) => {
        return date ? dayjs(date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
    }

    const addDays = (date: string, days: number) => {
        return dayjs(date).add(days, 'day')
    }

    const addMinutes = (date: number, minutes: number) => {
        return dayjs(date).add(minutes, 'm')
    }

    return {getDate, addDays, addMinutes}
}

export default useDayJs()