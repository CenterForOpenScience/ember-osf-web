import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('dropzone-widget', 'Integration | Component | dropzone widget', {
    integration: true,
});

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{dropzone-widget}}`);

    assert.equal(this.$().text().trim(), 'Drop files here to upload');
});
