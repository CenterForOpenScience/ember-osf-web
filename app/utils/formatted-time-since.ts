import moment from 'moment';

/**
 *
 * @param dateTime: reference time used to calculate relative time. Should be in the past.
 */
export default function formattedTimeSince(dateTime: Date) {
    const now = moment.utc();
    let then = moment.utc(dateTime);
    then = then > now ? now : then;
    return then.fromNow();
}
