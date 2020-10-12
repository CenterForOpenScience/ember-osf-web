import { helper } from '@ember/component/helper';

import formattedTimeSince from 'ember-osf-web/utils/formatted-time-since';

export function timeSince([time]: [Date]) {
    return formattedTimeSince(time);
}

export default helper(timeSince);
