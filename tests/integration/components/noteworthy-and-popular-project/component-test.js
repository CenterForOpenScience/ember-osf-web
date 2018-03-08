import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import FactoryGuy, { manualSetup } from 'ember-data-factory-guy';

moduleForComponent('noteworthy-and-popular-project', 'Integration | Component | noteworthy and popular project', {
    integration: true,

    beforeEach() {
        manualSetup(this.container);
    },
});

test('it renders', function(assert) {
    this.set('project', FactoryGuy.make('node'));
    this.render(hbs`{{noteworthy-and-popular-project project=project}}`);
    assert.ok(this.$().text().trim());
});
