import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('file-browser-item', 'Integration | Component | file browser item', {
    integration: true,
    beforeEach() {
        const item = {
            itemName: 'An item',
            size: 1000,
            dateModified: 'Tue Aug 08 2017 13:59:47 GMT-0400 (EDT)',
            path: '/where_this_item_lives',
            currentVersion: 2,
            extra: {
                downloads: 192830,
            },
        };
        this.set('item', item);
    },
});

// TEST DISPLAY
test('it renders with all default columns', function(assert) {
    this.render(hbs`{{file-browser-item item=item}}`);

    assert.ok(this.$().html().indexOf('An item') !== -1, "Name of the item didn't appear, when it should've.");
    assert.ok(this.$().html().indexOf('kB') !== -1, "Size didn't appear, when it should've.");
    assert.ok(this.$().html().indexOf('version-link') !== -1, "Version of item didn't appear, when it should've.");
    assert.ok(this.$().html().indexOf('192830') !== -1, "Download count didn't appear, when it should've.");
    assert.ok(this.$().html().indexOf('2017') !== -1, "Modified date didn't appear, when it should've.");
    assert.ok(this.$().html().indexOf('flash-message') === -1, "Flash message appeared when it shouldn't have.");
});

test('it renders with some of the columns', function(assert) {
    this.set('display', ['share-link-column', 'size-column']);
    this.render(hbs`{{file-browser-item item=item display=display}}`);

    assert.ok(this.$().html().indexOf('An item') !== -1, "Name of the item didn't appear, when it should've.");
    assert.ok(this.$().html().indexOf('kB') !== -1, "Size didn't appear, when it should've.");
    assert.ok(this.$().html().indexOf('version-link') === -1, "Version of item appeared when it shouldn't have.");
    assert.ok(this.$().html().indexOf('192830') === -1, "Download count appeared when it shouldn't have.");
    assert.ok(this.$().html().indexOf('2017') === -1, "Modified date appeared when it shouldn't have.");
});

test('always displays name', function(assert) {
    this.set('display', []);
    this.render(hbs`{{file-browser-item item=item display=display}}`);

    assert.ok(this.$().html().indexOf('An item') !== -1, "Name of the item didn't appear, when it should've.");
    assert.ok(this.$().html().indexOf('kB') === -1, "Size appeared when it shouldn't have.");
    assert.ok(this.$().html().indexOf('version-link') === -1, "Version of item appeared when it shouldn't have.");
    assert.ok(this.$().html().indexOf('192830') === -1, "Download count appeared when it shouldn't have.");
    assert.ok(this.$().html().indexOf('2017') === -1, "Modified date appeared when it shouldn't have.");
});

// TEST FLASH message (at some point look at testing its dissapearnace)
test('flash appears, replaces everything else', function(assert) {
    const item = this.get('item');
    item.flash = {
        message: 'Welp',
        type: 'danger',
    };
    this.set('item', item);
    this.render(hbs`{{file-browser-item item=item}}`);

    assert.ok(this.$().html().indexOf('An item') === -1, "Name of the item appeared when it shouldn't have.");
    assert.ok(this.$().html().indexOf('kB') === -1, "Size appeared when it shouldn't have.");
    assert.ok(this.$().html().indexOf('version-link') === -1, "Version of item appeared when it shouldn't have.");
    assert.ok(this.$().html().indexOf('192830') === -1, "Download count appeared when it shouldn't have.");
    assert.ok(this.$().html().indexOf('2017') === -1, "Modified date appeared when it shouldn't have.");
    assert.ok(this.$().html().indexOf('flash-message') !== -1, "Flash message didn't appear, when it should've.");
    assert.ok(this.$().html().indexOf('alert-danger') !== -1, "Danger flash didn't appear, when it should've.");
});
