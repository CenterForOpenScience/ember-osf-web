import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('search-dropdown', 'Integration | Component | search dropdown', {
    integration: true,
});

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{search-dropdown}}`);

    // assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(hbs`
    {{#search-dropdown}}
      template block text
    {{/search-dropdown}}
  `);

    // assert.equal(this.$().text().trim(), 'template block text');
    // TODO: Implement tests
    assert.ok(true);
});
