import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('new-project-modal', 'Integration | Component | new project modal', {
    integration: true,
});

test('it renders', function(assert) {
    this.render(hbs`{{new-project-modal}}`);
    assert.ok(this.$().text().trim());
});
