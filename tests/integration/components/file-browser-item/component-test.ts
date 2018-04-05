import EmberObject from '@ember/object';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | file-browser-item', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function() {
        const item = EmberObject.create({
            itemName: 'An item',
            size: 1000,
            dateModified: 'Tue Aug 08 2017 13:59:47 GMT-0400 (EDT)',
            path: '/where_this_item_lives',
            currentVersion: 2,
            extra: {
                downloads: 192830,
            },
        });

        this.set('item', item);
    });

    // TEST DISPLAY
    test('it renders with all default columns', async function(assert) {
        await render(hbs`{{file-browser-item item=item}}`);

        const html = this.$().html();

        assert.ok(html.includes('An item'), "Name of the item didn't appear, when it should've.");
        assert.ok(html.includes('kB'), "Size didn't appear, when it should've.");
        assert.ok(html.includes('version-link'), "Version of item didn't appear, when it should've.");
        assert.ok(html.includes('192830'), "Download count didn't appear, when it should've.");
        assert.ok(html.includes('2017'), "Modified date didn't appear, when it should've.");
        assert.notOk(html.includes('flash-message'), "Flash message appeared when it shouldn't have.");
    });

    // TEST FLASH message (at some point look at testing its dissapearnace)
    test('flash appears, replaces everything else', async function(assert) {
        const item = this.get('item');
        item.flash = {
            message: 'Welp',
            type: 'danger',
        };
        this.set('item', item);
        await render(hbs`{{file-browser-item item=item}}`);

        const html = this.$().html();

        assert.notOk(html.includes('An item'), "Name of the item appeared when it shouldn't have.");
        assert.notOk(html.includes('kB'), "Size appeared when it shouldn't have.");
        assert.notOk(html.includes('version-link'), "Version of item appeared when it shouldn't have.");
        assert.notOk(html.includes('192830'), "Download count appeared when it shouldn't have.");
        assert.notOk(html.includes('2017'), "Modified date appeared when it shouldn't have.");
        assert.ok(html.includes('flash-message'), "Flash message didn't appear, when it should've.");
        assert.ok(html.includes('alert-danger'), "Danger flash didn't appear, when it should've.");
    });
});
