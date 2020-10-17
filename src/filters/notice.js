export function transTime(timeStr) {
    return timeStr?timeStr.slice(0,4)+'-'+timeStr.slice(4,6)+'-'+timeStr.slice(6,8) : ''
}