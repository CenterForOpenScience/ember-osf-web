import param from 'ember-osf-web/utils/param';
import { module, test } from 'qunit';

module('Unit | Utility | param', () => {
    test('it creates a query string from params', function(assert) {
        assert.equal(
            param({
                foo: 'boo',
                bar: 'car',
            }),
            'foo=boo&bar=car',
        );
    });

    test('it creates an empty query string from empty params', function(assert) {
        assert.equal(
            param({}),
            '',
        );
    });

    test('it url encodes keys and values', function(assert) {
        assert.equal(
            param({
                'foo/bar': 'boo,hoo',
            }),
            'foo%2Fbar=boo%2Choo',
        );
    });
});
