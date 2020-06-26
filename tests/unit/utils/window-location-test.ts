import { module, test } from 'qunit';

import WindowLocation from 'ember-osf-web/utils/window-location';

module('Unit | Utility | window-location', () => {
    test('assignLocation throws an error in tests', assert => {
        assert.throws(
            () => WindowLocation.assignLocation('https://github.com'),
            'assignLocation throws an error in test environment',
        );
    });

    test('reloadPage throws an error in tests', assert => {
        assert.throws(() => WindowLocation.reloadPage(), 'reloadPage throws an error in test environment');
    });
});
