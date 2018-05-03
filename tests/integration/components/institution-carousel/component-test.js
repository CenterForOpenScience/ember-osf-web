import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('institution-carousel', 'Integration | Component | institution carousel', {
    integration: true,
});

test('it renders', function(assert) {
    this.render(hbs`{{institution-carousel}}`);
    assert.equal(this.$().text().trim(), '');
});
