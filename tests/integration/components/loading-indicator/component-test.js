import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('loading-indicator', 'Integration | Component | loading indicator', {
    integration: true,
});

test('it renders', function(assert) {
    this.render(hbs`{{loading-indicator}}`);
    assert.ok(this.$().text().trim());
});
