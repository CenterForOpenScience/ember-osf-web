import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sort-button', 'Integration | Component | sort button', {
    integration: true,
});

test('it renders', function(assert) {
    this.render(hbs`{{sort-button}}`);
    assert.ok(this.$().text().trim());
});
