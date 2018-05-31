import { render } from '@ember/test-helpers';
import { make, setupFactoryGuy } from 'ember-data-factory-guy';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | quickfile-nav', hooks => {
    setupRenderingTest(hooks);
    setupFactoryGuy(hooks);

    test('it renders', async function(assert) {
        this.set('user', make('user'));

        await render(hbs`{{quickfile-nav user=user}}`);

        assert.ok((this.element.textContent as string).trim());
    });
});
