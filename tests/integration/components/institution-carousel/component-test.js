import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | institution carousel', function(hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        await render(hbs`{{institution-carousel}}`);
        assert.equal(this.$().text().trim(), '');
    });
});
