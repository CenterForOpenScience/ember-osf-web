import { render } from '@ember/test-helpers';
import { make, setupFactoryGuy } from 'ember-data-factory-guy';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | institutions-widget', hooks => {
    setupRenderingTest(hooks);
    setupFactoryGuy(hooks);

    test('it renders', async function(assert) {
        this.set('user', make('user'));

        await render(hbs`{{institutions-widget user=user}}`);

        assert.dom('[data-test-institutions-widget]').exists();
    });

    test('read-only', async function(assert) {
        this.set('user', make('user'));

        await render(hbs`{{institutions-widget user=user readOnly=true}}`);

        assert.dom('[data-test-institutions-widget]').exists();
    });
});
