import moment from 'moment';

/**
 *
 * @param dateTime: reference time used to calculate relative time. Should be in the past.
 */
export default function formattedTimeSince(dateTime: Date) {
    // TODO: Let's add some assertions and update the tests to be more robust
    const now = moment.utc();
    let then = moment.utc(dateTime);
    then = then > now ? now : then;
    return then.fromNow();
}
