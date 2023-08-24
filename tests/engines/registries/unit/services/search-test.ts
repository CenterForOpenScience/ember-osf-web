import { EnginesTestContext } from 'ember-engines/test-support';
import { setupEngineTest } from 'ember-osf-web/tests/helpers/engines';
import { is, OrderedSet } from 'immutable';
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

module('Registries | Unit | Service | search', hooks => {
    setupEngineTest(hooks, 'registries');

    // Replace this with your real tests.
    test('it exists', function(this: EnginesTestContext, assert) {
        const service = this.engine.lookup('service:search');
        assert.ok(service);
    });

    test('SearchOptions immutable', assert => {
        const options = new SearchOptions({ page: 10 });
        const changed = options.set('page', 420);

        assert.equal(options.page, 10);
        assert.equal(changed.page, 420);
    });

    test('SearchOptions equality', assert => {
        assert.ok(is(
            new SearchOptions({ query: 'Foo Bar' }),
            new SearchOptions({ query: 'Foo Bar' }),
        ));

        assert.notOk(is(
            new SearchOptions({ query: 'Foo Bar' }),
            new SearchOptions({ query: 'Foo bar' }),
        ));

        assert.ok(is(
            new SearchOptions({
                filters: OrderedSet([
                    new TestSearchFilter('Foo', 'foo', 43),
                ]),
            }),
            new SearchOptions({
                filters: OrderedSet([
                    new TestSearchFilter('Foo', 'foo', 43),
                ]),
            }),
        ));

        assert.ok(is(
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
        ));
    });
});
