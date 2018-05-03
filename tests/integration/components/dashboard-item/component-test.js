import { moduleForComponent, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('dashboard-item', 'Integration | Component | dashboard item', {
    integration: true,
});

skip('it renders', function(assert) {
    this.render(hbs`{{dashboard-item}}`);

    assert.ok(this.$().text().trim());
});
