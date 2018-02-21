import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('contributor-list', 'Integration | Component | contributor list', {
    integration: true,
});

test('it renders', function(assert) {
    this.render(hbs`{{contributor-list}}`);
    assert.equal(this.$().text().trim(), '');
});
