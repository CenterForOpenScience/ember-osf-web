import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import config from 'ember-get-config';

const { OSF: { renderUrl } } = config;

moduleForComponent('file-renderer', 'Integration | Component | file renderer', {
    integration: true,
});

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{file-renderer}}`);

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(hbs`
        {{#file-renderer}}
        {{/file-renderer}}
    `);

    assert.equal(this.$().text().trim(), '');
});

test('file rendering defaults', function(assert) {
    const download = 'someTruthyValue';
    this.set('download', download);
    this.render(hbs`
      {{#file-renderer download=download}}
        {{/file-renderer}}
    `);

    assert.equal(this.$('iframe').attr('height'), '100%');
    assert.equal(this.$('iframe').attr('width'), '100%');
    const expected = `${renderUrl}?url=${encodeURIComponent(`${download}?direct&mode=render&initialWidth=766`)}`;
    assert.equal(this.$('iframe').attr('src'), expected);
});

test('specify file rendering parameters', function(assert) {
    this.set('download', 'http://cos.io/');
    this.set('height', '500');
    this.set('width', '500');

    this.render(hbs`
        {{#file-renderer download=download height=height width=width}}
        {{/file-renderer}}
    `);

    assert.equal(this.$('iframe').attr('height'), '500');
    assert.equal(this.$('iframe').attr('width'), '500');
    const expected = `${renderUrl}?url=${encodeURIComponent('http://cos.io/?direct&mode=render&initialWidth=766')}`;
    assert.equal(this.$('iframe').attr('src'), expected);
});
