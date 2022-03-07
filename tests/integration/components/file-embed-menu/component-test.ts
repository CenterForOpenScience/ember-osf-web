import { render } from '@ember/test-helpers';
import click from '@ember/test-helpers/dom/click';
import { hbs } from 'ember-cli-htmlbars';
import { setupIntl, t } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | file-embed-menu', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    test('it renders', async function(assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });
        this.set('file', {
            links: {
                render: 'http://render.url/',
            },
        });
        await render(hbs`
        <FileEmbedMenu @file={{this.file}} as |dd|>
            <dd.trigger
                data-test-embed-button
                data-analytics-name='Expand embed menu'
                aria-label={{t 'general.embed'}}
            >
                <Button
                    @layout='fake-link'
                >
                    <FaIcon @icon='file-import' />
                    {{t 'general.embed'}}
                </Button>
            </dd.trigger>
        </FileEmbedMenu>`);
        await click('[data-test-embed-button]');
        assert.dom('[data-test-copy-js]').hasText(t('file_actions_menu.copy_js'));
        assert.dom('[data-test-copy-html]').hasText(t('file_actions_menu.copy_html'));

    });
});
