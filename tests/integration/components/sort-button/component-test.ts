
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sort-button', 'Integration | Component | sort button', {
    integration: true,
    beforeEach(assert) {
        this.set('sortAction', () => assert.ok(true));
    },
});

test('selected works with sortBy', function (assert) {
    this.render(hbs`{{sort-button sortAction=sortAction sortBy='kindness' sort='-kindndess'}}`);

    assert.ok(this.$('button').length, 2);
    assert.ok(this.$('.not-selected').length, 'sortBy doesn\'t match, should be unselected');
});
