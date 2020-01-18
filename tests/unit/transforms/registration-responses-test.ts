import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { responseKeyPrefix } from 'ember-osf-web/transforms/registration-response-key';
import RegistrationResponsesTransform from 'ember-osf-web/transforms/registration-responses';

module('Unit | Transform | registration-responses', hooks => {
    setupTest(hooks);

    test('deserialize', function(assert) {
        const transform: RegistrationResponsesTransform = this.owner.lookup('transform:registration-responses');

        assert.deepEqual(
            transform.deserialize({ foo: 'baz' }),
            { [`${responseKeyPrefix}foo`]: 'baz' },
            'adds response key prefix',
        );

        assert.deepEqual(
            transform.deserialize({ 'foo.bar': 'baz' }),
            { [`${responseKeyPrefix}foo|bar`]: 'baz' },
            'adds response key prefix and transforms dots to pipes',
        );

        assert.deepEqual(
            transform.deserialize(null),
            {},
            'transforms null to empty object',
        );

        assert.deepEqual(
            transform.deserialize({ a: 'foo', [Symbol('Sym')]: 'bar' }),
            { [`${responseKeyPrefix}a`]: 'foo' },
            'symbol-keyed properties are removed',
        );
    });

    test('serialize', function(assert) {
        const transform: RegistrationResponsesTransform = this.owner.lookup('transform:registration-responses');

        assert.deepEqual(
            transform.serialize({ [`${responseKeyPrefix}foo`]: 'baz' }),
            { foo: 'baz' },
            'removes response key prefix',
        );

        assert.deepEqual(
            transform.serialize({ [`${responseKeyPrefix}foo|bar`]: 'baz' }),
            { 'foo.bar': 'baz' },
            'removes response key prefix and transforms pipes to dots',
        );

        assert.throws(
            () => transform.serialize({ foo: 'bar' }),
            'throws exception when response key prefix is missing',
        );
    });
});
