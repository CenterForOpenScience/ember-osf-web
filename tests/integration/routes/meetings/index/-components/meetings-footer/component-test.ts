import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupIntl } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | meetings-footer', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    test('it renders', async function(assert) {
        await render(hbs`<Meetings::Index::-Components::MeetingsFooter />`);
        assert.dom('[data-test-eye-icon]').exists({ count: 1 }, '1 fa-eye icon');
        assert.dom('[data-test-share-alt-icon]').exists({ count: 1 }, '1 fa-share-alt icon');
        assert.dom('[data-test-magic-icon]').exists({ count: 1 }, '1 fa-magic icon');
        assert.dom('[data-test-aps-img]').exists({ count: 1 }, '1 APS image');
        assert.dom('[data-test-bitss-img]').exists({ count: 1 }, '1 BITSS image');
        assert.dom('[data-test-nrao-img]').exists({ count: 1 }, '1 NRAO image');
        assert.dom('[data-test-spsp-img]').exists({ count: 1 }, '1 SPSP image');
    });
});
