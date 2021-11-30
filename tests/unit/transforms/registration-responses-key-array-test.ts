import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { responseKeyPrefix } from 'ember-osf-web/transforms/registration-response-key';
import RegistrationResponseKeyArrayTransform from 'ember-osf-web/transforms/registration-response-key-array';

module('Unit | Transform | registration-responses', hooks => {
    setupTest(hooks);

    test('deserializes', function(assert) {
        const transform: RegistrationResponseKeyArrayTransform = this.owner.lookup(
            'transform:registration-response-key-array',
        );

        assert.deepEqual(
            transform.deserialize([ 'foo', 'bar' ]),
            [`${responseKeyPrefix}foo`, `${responseKeyPrefix}bar`],
            'adds response key prefix to all members of array',
        );

        assert.deepEqual(
            transform.deserialize(['foo.bar', 'foo.baz']),
            [`${responseKeyPrefix}foo|bar`, `${responseKeyPrefix}foo|baz`],
            'adds response key prefix and transforms dots to pipes for all members of array',
        );

        assert.deepEqual(
            transform.deserialize(null),
            [],
            'transforms null to empty array',
        );
    });

    test('serialize', function(assert) {
        const transform: RegistrationResponseKeyArrayTransform = this.owner.lookup(
            'transform:registration-response-key-array',
        );

        assert.deepEqual(
            transform.serialize([`${responseKeyPrefix}foo`, `${responseKeyPrefix}baz`]),
            ['foo', 'baz'],
            'removes response key prefix for all members of array',
        );

        assert.deepEqual(
            transform.serialize([`${responseKeyPrefix}foo|bar`, `${responseKeyPrefix}foo|baz`]),
            ['foo.bar', 'foo.baz'],
            'removes response key prefix and transforms pipes to dots for all members of array',
        );

        assert.deepEqual(
            transform.serialize(null),
            [],
            'transforms null to empty array',
        );
    });
});
