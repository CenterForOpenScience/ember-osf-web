import humanFileSize from 'ember-osf-web/utils/human-file-size';
import { module, test } from 'qunit';

module('Unit | Utility | human-file-size', () => {
    test('it shows bytes', assert => {
        const result = humanFileSize(5);
        assert.equal(result, '5 B');
    });

    test('it shows si', assert => {
        const result = humanFileSize(5 * 1e6);
        assert.equal(result, '5 MB');
    });

    test('it shows not si', assert => {
        const result = humanFileSize(5 * (1024 ** 2), false);
        assert.equal(result, '5 MiB');
    });
});
