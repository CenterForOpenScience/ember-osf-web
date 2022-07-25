import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import faker from 'faker';
import { module, test } from 'qunit';

import styles from 'osf-components/components/expandable-preview/styles';

module('Integration | Component | expandable-preview', hooks => {
    setupRenderingTest(hooks);

    test('it renders short text', async function(assert) {
        this.set('content', faker.lorem.sentences(1));
        await render(hbs`
        <ExpandablePreview>
            {{this.content}}
        </ExpandablePreview>`);
        assert.dom('[data-test-collapse-overlay]').doesNotExist('No overlay');
        assert.dom('[data-test-collapse-button]').doesNotExist('No collapse button');
    });

    test('it renders long text', async function(assert) {
        this.set('content', faker.lorem.sentences(500));

        await render(hbs`
        <ExpandablePreview>
            {{this.content}}
        </ExpandablePreview>`);

        assert.dom('[data-test-collapse-overlay]').exists('Overlay shown by default');
        assert.dom('[data-test-collapse-button]').exists('Collapse button shown');

        assert.dom('[data-test-preview-wrapper]').hasStyle({ maxHeight: '200px' }, 'Preview default max height is 200');
        assert.dom('[data-test-collapse-overlay]').hasClass(styles.Wrapper__Collapsed, 'Wrapper collapsed class');
        assert.dom('[data-test-collapse-button]').hasText(t('osf-components.expandable-preview.show_more'));
        assert.dom('[data-test-collapse-button] svg').hasClass('fa-caret-down', 'Caret down icon');
        assert.dom('[data-test-collapse-overlay]').exists('Overlay shown by default');

        await click('[data-test-collapse-button]');
        assert.dom('[data-test-collapse-overlay]').doesNotHaveClass(styles.Wrapper__Collapsed, 'Wrapper not collapsed');
        assert.dom('[data-test-collapse-button]').hasText(t('osf-components.expandable-preview.show_less'));
        assert.dom('[data-test-collapse-button] svg').hasClass('fa-caret-up', 'Caret up icon');
    });

    test('it renders short text with options', async function(assert) {
        this.set('content', faker.lorem.sentences(1));
        await render(hbs`
        <ExpandablePreview @height={{1}} @open={{true}}>
            {{this.content}}
        </ExpandablePreview>`);
        assert.dom('[data-test-collapse-overlay]').exists('Overlay present');
        assert.dom('[data-test-collapse-overlay]').doesNotHaveClass(styles.Wrapper__Collapsed,
            'Overlay does not have collapsed class');
        assert.dom('[data-test-collapse-button]').exists('Collapse button shown');
        assert.dom('[data-test-collapse-button]').hasText(t('osf-components.expandable-preview.show_less'));
        assert.dom('[data-test-collapse-button] svg').hasClass('fa-caret-up', 'Caret up icon');
    });
});
