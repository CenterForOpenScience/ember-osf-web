import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('noteworthy-and-popular-project', 'Integration | Component | noteworthy and popular project', {
    integration: true,
});

test('it renders', function(assert) {
    this.set('project', FactoryGuy.make('node'));
    this.render(hbs`{{noteworthy-and-popular-project project=project}}`);
    assert.ok(this.$().text().trim());
});
