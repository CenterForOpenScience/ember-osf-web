import engineResolverFor from 'ember-engines/test-support/engine-resolver-for';
import { moduleFor, test } from 'ember-qunit';

const resolver = engineResolverFor('collections');

moduleFor('route:provider/submit', 'Unit | Route | collections/provider/submit', {
    needs: [
    ],
    resolver,
});

test('it exists', function(assert) {
    const route = this.subject();
    assert.ok(route);
});
