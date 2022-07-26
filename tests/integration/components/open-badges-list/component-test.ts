import { render } from '@ember/test-helpers';
import triggerEvent from '@ember/test-helpers/dom/trigger-event';
import { hbs } from 'ember-cli-htmlbars';
import { setupIntl, t } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { setBreakpoint } from 'ember-responsive/test-support';
import { module, test } from 'qunit';

module('Integration | Component | open-badges-list', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    test('it renders in the all true state desktop view', async function(assert) {
        setBreakpoint('desktop');
        await render(hbs`<OpenBadgesList
            @hasData={{true}}
            @hasMaterials={{true}}
        />`);
        assert.dom('[data-test-badge-list-title]')
            .hasText(t('osf-components.open-badges-list.title'), 'Title shows in desktop');
        assert.dom('[data-test-badge-item]').exists({count: 2}, 'All the badges are there');
        assert.dom('[data-test-badge-image="data"]').hasAttribute(
            'src',
            '/assets/images/badges/data_small_color.png',
            'Data badge has correct image',
        );
        assert.dom('[data-test-badge-image="materials"]').hasAttribute(
            'src',
            '/assets/images/badges/materials_small_color.png',
            'Materials badge has correct image',
        );
        assert.dom('[data-test-badge-item="data"]').hasText(
            t('osf-components.open-badges-list.open-data'),
            'Text label shows for data badge in desktop',
        );
        assert.dom('[data-test-badge-item="materials"]').hasText(
            t('osf-components.open-badges-list.open-materials'),
            'Text label shows for materials badge in desktop',
        );
        await triggerEvent('[data-test-badge-icon="data"]', 'mouseenter');
        assert.dom('.ember-bootstrap-tooltip .tooltip-inner').doesNotExist(
            'No tooltip in desktop view for data',
        );
        await triggerEvent('[data-test-badge-icon="materials"]', 'mouseenter');
        assert.dom('.ember-bootstrap-tooltip .tooltip-inner').doesNotExist(
            'No tooltip in desktop view for materials',
        );
    });

    test('it renders in the all false state mobile view', async function(assert) {
        setBreakpoint('mobile');
        await render(hbs`<OpenBadgesList
            @hasData={{false}}
            @hasMaterials={{false}}
        />`);
        assert.dom('[data-test-badge-list-title]')
            .doesNotExist('Title does not show in mobile');
        assert.dom('[data-test-badge-item]').exists({count: 2}, 'All the badges are there');
        assert.dom('[data-test-badge-image="data"]').hasAttribute(
            'src',
            '/assets/images/badges/data_small_gray.png',
            'Data badge has correct image',
        );
        assert.dom('[data-test-badge-image="materials"]').hasAttribute(
            'src',
            '/assets/images/badges/materials_small_gray.png',
            'Materials badge has correct image',
        );
        assert.dom('[data-test-badge-item="data"]').doesNotHaveTextContaining(
            t('osf-components.open-badges-list.open-data'),
            'Text label does not show for data badge in mobile',
        );
        assert.dom('[data-test-badge-item="materials"]').doesNotHaveTextContaining(
            t('osf-components.open-badges-list.open-materials'),
            'Text label does not show for materials badge in mobile',
        );
        await triggerEvent('[data-test-badge-icon="data"]', 'mouseenter');
        assert.dom('.ember-bootstrap-tooltip .tooltip-inner').hasText(
            t('osf-components.open-badges-list.no-open-data-mobile'),
            'Correct tooltip in mobile view for data',
        );
        await triggerEvent('[data-test-badge-icon="data"]', 'mouseleave');
        await triggerEvent('[data-test-badge-icon="materials"]', 'mouseenter');
        assert.dom('.ember-bootstrap-tooltip .tooltip-inner').hasText(
            t('osf-components.open-badges-list.no-open-materials-mobile'),
            'Correct tooltip in mobile view for materials',
        );
    });

    test('it renders in the all true state mobile view', async function(assert) {
        setBreakpoint('mobile');
        await render(hbs`<OpenBadgesList
            @hasData={{true}}
            @hasMaterials={{true}}
        />`);
        assert.dom('[data-test-badge-image="data"]').hasAttribute(
            'src',
            '/assets/images/badges/data_small_color.png',
            'Data badge has correct image',
        );
        assert.dom('[data-test-badge-image="materials"]').hasAttribute(
            'src',
            '/assets/images/badges/materials_small_color.png',
            'Materials badge has correct image',
        );
        await triggerEvent('[data-test-badge-icon="data"]', 'mouseenter');
        assert.dom('.ember-bootstrap-tooltip .tooltip-inner').hasText(
            t('osf-components.open-badges-list.open-data-mobile'),
            'Correct tooltip in mobile view for data',
        );
        await triggerEvent('[data-test-badge-icon="data"]', 'mouseleave');
        await triggerEvent('[data-test-badge-icon="materials"]', 'mouseenter');
        assert.dom('.ember-bootstrap-tooltip .tooltip-inner').hasText(
            t('osf-components.open-badges-list.open-materials-mobile'),
            'Correct tooltip in mobile view for materials',
        );
    });
});
