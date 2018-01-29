import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sort-button', 'Integration | Component | sort button', {
    integration: true,
    beforeEach() {
        this.set('sortAction', () => {});
    },
});

test('selected works with sortBy', function(assert) {
    this.render(hbs`{{sort-button sort=sortAction curOrder='desc' curBy='speed' sortBy='kindness'}}`);
    assert.ok(this.$().html().indexOf('not-selected') !== -1, 'sortBy doesn\'t match, should be unselected');

    this.render(hbs`{{sort-button sort=sortAction curOrder='desc' curBy='kindness' sortBy='kindness'}}`);
    assert.ok(this.$().html().indexOf('not-selected') === -1, 'sortBy matches, should be selected');
});

