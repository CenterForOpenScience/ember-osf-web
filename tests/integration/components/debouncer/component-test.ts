import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | debouncer', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    test('it renders and performs the functions', async function(assert) {
        const dummyFunction = async () => {
            assert.ok('ok');
        };
        this.set('dummyFunction', dummyFunction);

        await render(hbs`
            <Debouncer
                @fn={{action this.dummyFunction}}
                @timeoutInterval=777
                as |debouncer|
            >
                <div data-test-debounced onclick={{debouncer.doFnDebounce}}>1, 2, 3...</div>
                <div data-test-now onclick={{debouncer.doFnNow}}>GO!</div>
            </Debouncer>
        `);

        click('[data-test-debounced]');
        assert.expect(0);
        click('[data-test-debounced]');
        assert.expect(0);
        await click('[data-test-debounced]');
        assert.expect(1);

        click('[data-test-now]');
        assert.expect(2);
        click('[data-test-now]');
        assert.expect(3);
        click('[data-test-now]');
        assert.expect(4);
    });
});
