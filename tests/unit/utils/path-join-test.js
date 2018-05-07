import pathJoin from 'ember-osf-web/utils/path-join';
import { module, test } from 'qunit';

module('Unit | Utility | path join', function() {
    test('it works', function(assert) {
        const result = pathJoin('/this/', 'has', 'all/', '/combos', '/of-slashes');
        assert.equal(result, '/this/has/all/combos/of-slashes');
    });
});
