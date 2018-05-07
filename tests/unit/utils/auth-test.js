import authUtils from 'ember-osf-web/utils/auth';

import {
    module,
    test,
} from 'qunit';

module('Unit | Utility | auth', function() {
    test('getAuthUrl works', function(assert) {
        const result = authUtils.getAuthUrl();
        assert.ok(result);
    });

    test('getTokenFromHash works', function(assert) {
        const result = authUtils.getTokenFromHash('#access_token=foo');
        assert.equal(result, 'foo');
    });
});
