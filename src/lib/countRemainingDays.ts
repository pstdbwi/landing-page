import dayjs from 'dayjs';

export function getRemainingDays(targetUnixTimestamp: number): number {
    const now = dayjs();
    const targetDate = dayjs.unix(targetUnixTimestamp);
    let remainingDays = targetDate.diff(now, 'day');

    if (remainingDays < 0) {
        remainingDays = 0;
    }

    return remainingDays;
}