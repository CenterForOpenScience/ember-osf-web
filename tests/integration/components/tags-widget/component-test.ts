import { click, fillIn, find, render, triggerKeyEvent } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | tags-widget', hooks => {
    setupRenderingTest(hooks);

    test('it renders passed-in tags', async function(assert) {
        const tags = ['foo', 'bar', 'baz'];
        this.set('tags', tags);
        this.set('addTag', (_: string) => undefined);
        this.set('removeTag', (_: number) => undefined);
        this.set('showAdd', false);

        await render(hbs`{{tags-widget
            tags=this.tags
            analyticsLabel='test'
            addTag=(action this.addTag)
            removeTag=(action this.removeTag)
            showAdd=this.showAdd
        }}`);

        assert.dom('[data-test-tags-widget-tag-input]').exists();

        tags.forEach(tag => assert.dom(`[data-test-tags-widget-tag="${tag}"]`).exists());

        assert.dom('[data-test-tags-widget-tag-input] input').isNotVisible();

        this.set('showAdd', true);
        assert.dom('[data-test-tags-widget-tag-input] input').isVisible();
    });

    test('it renders passed-in tags (read only)', async function(assert) {
        const tags = ['foo', 'bar', 'baz'];
        this.set('tags', tags);

        await render(hbs`{{tags-widget tags=this.tags analyticsLabel='test' readOnly=true}}`);

        assert.dom('[data-test-tags-widget-tag-input]').exists();

        tags.forEach(tag => assert.dom(`[data-test-tags-widget-tag="${tag}"]`).exists());

        assert.dom('[data-test-tags-widget-tag-input] input').isNotVisible();
    });

    test('it renders passed-in tags (read only, inline)', async function(assert) {
        const tags = ['foo', 'bar', 'baz'];
        this.set('tags', tags);

        await render(hbs`{{tags-widget
            tags=this.tags
            analyticsLabel='test'
            readOnly=true
            inline=true
        }}`);

        assert.dom('[data-test-tags-widget-tag-input]').exists();

        tags.forEach(tag => assert.dom(`[data-test-tags-widget-tag="${tag}"]`).exists());

        assert.dom('[data-test-tags-widget-tag-input] input').isNotVisible();

        assert.equal(
            ((find('[data-test-tags-widget-tag-input]') as HTMLElement).parentElement as HTMLElement)
                .className.split(' ').filter(cssClass => /^_inline_/.test(cssClass)).length,
            1,
            'Contains inline class',
        );
    });

    test('it can add tags', async function(assert) {
        // TODO: enable this if we can figure out a way to make keyboard events always fire
        // assert.expect(2);

        const newTag = 'new tag';

        this.set('tags', []);

        this.set('addTag', (tag: string) => {
            assert.equal(tag, newTag, 'addTag action was triggered for new tag');
        });

        this.set('removeTag', (_: number) => undefined);

        await render(hbs`{{tags-widget
            tags=this.tags
            analyticsLabel='test'
            addTag=(action this.addTag)
            removeTag=(action this.removeTag)
            showAdd=true
        }}`);

        assert.dom('[data-test-tags-widget-tag-input]').exists();

        await fillIn('[data-test-tags-widget-tag-input] input', newTag);

        await triggerKeyEvent('[data-test-tags-widget-tag-input] input', 'keypress', 'Enter');
    });

    test('it can remove tags', async function(assert) {
        assert.expect(2);

        const removeTag = 'remove me';

        this.set('tags', [removeTag]);

        this.set('addTag', (_: string) => undefined);

        this.set('removeTag', (index: number) => {
            assert.equal(index, 0, 'removeTag called for first tag');
        });

        await render(hbs`{{tags-widget
            tags=this.tags
            analyticsLabel='test'
            addTag=(action this.addTag)
            removeTag=(action this.removeTag)
            showAdd=true
        }}`);

        assert.dom('[data-test-tags-widget-tag-input]').exists();

        await click(`[data-test-tags-widget-tag="${removeTag}"] + a`);
    });
});
