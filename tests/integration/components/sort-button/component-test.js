import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sort-button', 'Integration | Component | sort button', {
    integration: true,
    beforeEach() {
        this.set('sortAction', () => {});
    },
});

test('ascending points up, selected works', function(assert) {
    this.render(hbs`{{sort-button sort=sortAction curOrder='asc' sortOrder='asc'}}`);
    assert.ok(this.$().html().indexOf('not-selected') === -1, 'sortOrder matches, should be selected');
    assert.ok(this.$().html().indexOf('-up') !== -1, 'sortOrder is asc, should point up');

    this.render(hbs`{{sort-button sort=sortAction curOrder='desc' sortOrder='asc'}}`);
    assert.ok(this.$().html().indexOf('not-selected') !== -1, 'sortOrder doesn\'t match, should be unselected');
    assert.ok(this.$().html().indexOf('-down') === -1, 'sortOrder is asc, should point up');
});

test('descending points down, selected works', function(assert) {
    this.render(hbs`{{sort-button sort=sortAction curOrder='desc' sortOrder='desc'}}`);
    assert.ok(this.$().html().indexOf('not-selected') === -1, 'sortOrder matches, should be selected');
    assert.ok(this.$().html().indexOf('-down') !== -1, 'sortOrder is desc should point down');

    this.render(hbs`{{sort-button sort=sortAction curOrder='asc' sortOrder='desc'}}`);
    assert.ok(this.$().html().indexOf('selected') !== -1, 'sortOrder doesn\'t match, should be unselected');
    assert.ok(this.$().html().indexOf('-up') === -1, 'sortOrder is desc should point down');
});

test('selected works with sortBy', function(assert) {
    this.render(hbs`{{sort-button sort=sortAction curOrder='desc' sortOrder='desc' curBy='speed' sortBy='kindness'}}`);
    assert.ok(this.$().html().indexOf('not-selected') !== -1, 'sortBy and sortOrder don\'t both match, should be unselected');

    this.render(hbs`{{sort-button sort=sortAction curOrder='desc' sortOrder='asc' curBy='kindness' sortBy='kindness'}}`);
    assert.ok(this.$().html().indexOf('not-selected') !== -1, 'sortBy and sortOrder don\'t both match, should be unselected');

    this.render(hbs`{{sort-button sort=sortAction curOrder='desc' sortOrder='asc' curBy='speed' sortBy='kindness'}}`);
    assert.ok(this.$().html().indexOf('not-selected') !== -1, 'sortBy and sortOrder don\'t both match, should be unselected');

    this.render(hbs`{{sort-button sort=sortAction curOrder='desc' sortOrder='desc' curBy='kindness' sortBy='kindness'}}`);
    assert.ok(this.$().html().indexOf('not-selected') === -1, 'sortBy and sortOrder both match, should be selected');
});

