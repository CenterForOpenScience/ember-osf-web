import { setupEngineTest } from 'ember-osf-web/tests/helpers/engines';
import { OrderedSet } from 'immutable';
import { module, test } from 'qunit';
import { SearchFilter, SearchOptions } from 'registries/services/search';

class TestSearchFilter extends SearchFilter {
    static TYPE = Symbol('TEST-FILTER');

    constructor(display: string, key: string, value: number) {
        super({
            key,
            value,
            display,
            type: TestSearchFilter.TYPE,
        });
    }

    apply(query: any) {
        return query;
    }
}

module('Unit | Registries | Service | Search', hooks => {
    setupEngineTest(hooks, 'registries');

    // Replace this with your real tests.
    test('it exists', function(assert) {
        const service = this.owner.lookup('service:');
        assert.ok(service);
    });

    test('SearchOptions immutable', assert => {
        const options = new SearchOptions({});
        const changed = options.set('page', 420);

        assert.equal(options.page, 10);
        assert.equal(changed.page, 420);
    });

    test('SearchOptions equality', assert => {
        assert.equal(
            new SearchOptions({ query: 'Foo Bar' }),
            new SearchOptions({ query: 'Foo Bar' }),
        );

        assert.notEqual(
            new SearchOptions({ query: 'Foo Bar' }),
            new SearchOptions({ query: 'Foo Bar' }),
        );

        assert.equal(
            new SearchOptions({
                filters: OrderedSet([
                    new TestSearchFilter('Foo', 'foo', 43),
                ]),
            }),
            new SearchOptions({
                filters: OrderedSet([
                    new TestSearchFilter('Foo', 'foo', 43),
                    new TestSearchFilter('Foo', 'foo', 43),
                ]),
            }),
        );
    });
});
