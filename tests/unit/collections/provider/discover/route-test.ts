import engineResolverFor from 'ember-engines/test-support/engine-resolver-for';
import { moduleFor, test } from 'ember-qunit';

const resolver = engineResolverFor('collections');

moduleFor('route:provider/discover', 'Unit | Route | collections/provider/discover', {
    needs: [
    ],
    resolver,
});

test('it exists', function(assert) {
    const route = this.subject();
    assert.ok(route);
});
