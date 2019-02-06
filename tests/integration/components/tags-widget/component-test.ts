import EmberObject from '@ember/object';
import { click as untrackedClick, fillIn, render, triggerKeyEvent } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

function fakeNode(tags: string[]) {
    return EmberObject.create({
        tags,
        save: () => null,
    });
}

module('Integration | Component | tags-widget', hooks => {
    setupRenderingTest(hooks);

    test('it renders passed-in tags', async function(assert) {
        const tags = ['foo', 'bar', 'baz'];
        this.set('node', fakeNode(tags));
        this.set('readOnly', true);

        await render(hbs`{{tags-widget
            taggable=this.node
            readOnly=this.readOnly
        }}`);

        assert.dom('[data-test-tags-widget-tag-input]').exists();

        tags.forEach(tag => assert.dom(`[data-test-tags-widget-tag="${tag}"]`).exists());

        assert.dom('[data-test-tags-widget-tag-input] input').isNotVisible();
        this.set('readOnly', false);
        assert.dom('[data-test-tags-widget-tag-input] input').isVisible();
    });

    test('it renders passed-in tags (read only)', async function(assert) {
        const tags = ['foo', 'bar', 'baz'];
        this.set('node', fakeNode(tags));

        await render(hbs`{{tags-widget taggable=this.node}}`);

        assert.dom('[data-test-tags-widget-tag-input]').exists();

        tags.forEach(tag => assert.dom(`[data-test-tags-widget-tag="${tag}"]`).exists());

        assert.dom('[data-test-tags-widget-tag-input] input').isNotVisible();
    });

    test('it can add tags', async function(assert) {
        const newTag = 'new tag';

        const fNode = fakeNode([]);
        this.set('node', fNode);

        await render(hbs`{{tags-widget
            taggable=this.node
            readOnly=false
        }}`);

        assert.dom('[data-test-tags-widget-tag-input]').exists();

        await fillIn('[data-test-tags-widget-tag-input] input', newTag);

        await triggerKeyEvent('[data-test-tags-widget-tag-input] input', 'keydown', 'Enter');
        await triggerKeyEvent('[data-test-tags-widget-tag-input] input', 'keyup', 'Enter');

        assert.deepEqual(fNode.tags, [newTag]);
    });

    test('it can remove tags', async function(assert) {
        const removeTag = 'remove me';
        const fNode = fakeNode([removeTag]);
        this.set('node', fNode);

        await render(hbs`{{tags-widget
            taggable=this.node
            readOnly=false
        }}`);

        assert.dom('[data-test-tags-widget-tag-input]').exists();

        await untrackedClick(`[data-test-tags-widget-tag="${removeTag}"] + a`);

        assert.deepEqual(fNode.tags, []);
    });
});
