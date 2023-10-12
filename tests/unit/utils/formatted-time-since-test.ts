import moment from 'moment-timezone';
import { module, test } from 'qunit';

import formattedTimeSince from 'ember-osf-web/utils/formatted-time-since';

module('Unit | Utility | formatted-time-since', () => {
    test('it shows just now', function(assert) {
        const from = moment().subtract(1, 'seconds').toDate();
        const result = formattedTimeSince(from);
        assert.equal(result, 'a few seconds ago');
    });

    test('it shows minutes ago', function(assert) {
        const from = moment().subtract(2, 'minutes').toDate();
        const result = formattedTimeSince(from);
        assert.equal(result, '2 minutes ago');
    });

    test('it shows hours ago', function(assert) {
        const from = moment().subtract(3, 'hours').toDate();
        const result = formattedTimeSince(from);
        assert.equal(result, '3 hours ago');
    });

    test('it shows days ago', function(assert) {
        const from = moment().subtract(4, 'days').toDate();
        const result = formattedTimeSince(from);
        assert.equal(result, '4 days ago');
    });
});
