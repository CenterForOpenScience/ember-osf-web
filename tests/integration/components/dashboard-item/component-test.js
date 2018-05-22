import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | dashboard item', function(hooks) {
    setupRenderingTest(hooks);

    skip('it renders', function(assert) {
        this.render(hbs`{{dashboard-item}}`);

        assert.ok(this.$().text().trim());
    });
});
