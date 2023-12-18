import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { click } from 'ember-osf-web/tests/helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';
import { setupIntl } from 'ember-intl/test-support';
import Service from '@ember/service';

class RouterStub extends Service {
    urlFor() {
        return 'http://example.com';
    }

    isActive() {
        return false;
    }
}

module('Integration | Component | addon-card', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    test('it renders: not enabled', async function(assert) {
        this.owner.unregister('service:router');
        this.owner.register('service:router', RouterStub);
        this.set('addon', {
            provider: { id: 'box', name: 'Test Addon' },
            disableProjectAddon: sinon.stub(),
            nodeAddon: { configured: false },
        });
        this.set('manager', {
            node: { id: 'testnode' },
            projectEnabledAddons: [],
        });

        await render(hbs`
            <AddonCard
                @addon={{this.addon}}
                @manager={{this.manager}}
            />
        `);

        assert.dom('[data-test-addon-card="Test Addon"]').exists();
        assert.dom('[data-test-addon-card-logo]').hasAttribute(
            'src', '/assets/images/addons/logos/box.png', 'Logo is correct',
        );
        assert.dom('[data-test-addon-card-logo]').hasAttribute('alt', 'Test Addon logo', 'Alt text is correct');
        assert.dom('[data-test-addon-card-title]').hasText('Test Addon');
        assert.dom('[data-test-addon-card-configure]').doesNotExist();
        assert.dom('[data-test-addon-card-disable]').doesNotExist();
        assert.dom('[data-test-addon-card-enable]').exists();
    });

    test('it renders: enabled', async function(assert) {
        this.owner.unregister('service:router');
        this.owner.register('service:router', RouterStub);
        const addonObj = {
            provider: { id: 'box', name: 'Test Addon' },
            disableProjectAddon: sinon.stub(),
            nodeAddon: { configured: true },
        };
        this.set('addon', addonObj);
        this.set('manager', {
            node: { id: 'testnode' },
            projectEnabledAddons: [addonObj],
        });

        await render(hbs`
            <AddonCard
                @addon={{this.addon}}
                @manager={{this.manager}}
            />
        `);

        assert.dom('[data-test-addon-card="Test Addon"]').exists();
        assert.dom('[data-test-addon-card-logo]').hasAttribute(
            'src', '/assets/images/addons/logos/box.png', 'Logo is correct',
        );
        assert.dom('[data-test-addon-card-logo]').hasAttribute('alt', 'Test Addon logo', 'Alt text is correct');
        assert.dom('[data-test-addon-card-title]').hasText('Test Addon');
        assert.dom('[data-test-addon-card-configure]').exists();
        assert.dom('[data-test-addon-card-disable]').exists();
        assert.dom('[data-test-addon-card-enable]').doesNotExist();

        await click('[data-test-addon-card-disable]');
        assert.dom('[data-test-addon-disable-modal-disable]').exists();
        assert.dom('#osf-dialog-heading').hasText('Disable Add-on');
        assert.dom('[data-test-dialog] main').containsText('Are you sure you want to disable this add-on?');
        await click('[data-test-addon-disable-modal-disable]');
        assert.ok(addonObj.disableProjectAddon.calledOnce);
    });
});
