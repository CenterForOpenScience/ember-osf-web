import { render, TestContext } from '@ember/test-helpers';
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

interface ThisTestContext extends TestContext {
    manager: any;
    addon: any;
}


module('Integration | Component | addon-card', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    test('it renders: not enabled', async function(this: ThisTestContext, assert) {
        this.owner.unregister('service:router');
        this.owner.register('service:router', RouterStub);
        this.addon = {
            provider: {
                id: 'box',
                name: 'Test Addon',
                iconUrl: 'https://some.url/from/addons/service/box.png',
            },
            disableProjectAddon: sinon.stub(),
            nodeAddon: { configured: false },
        };
        this.manager ={
            node: { id: 'testnode' },
            projectEnabledAddons: [],
            beginAccountSetup: sinon.stub(),
            listProviderConfigurations: sinon.stub(),
        };

        await render(hbs`
<AddonCard
    @addon={{this.addon}}
    @manager={{this.manager}}
/>
        `);

        assert.dom('[data-test-addon-card="Test Addon"]').exists();
        assert.dom('[data-test-addon-card-logo]').hasAttribute(
            'src', 'https://some.url/from/addons/service/box.png', 'Logo is correct',
        );
        assert.dom('[data-test-addon-card-logo]').hasAttribute('alt', 'Test Addon logo', 'Alt text is correct');
        assert.dom('[data-test-addon-card-title]').hasText('Test Addon');
        assert.dom('[data-test-addon-card-edit]').doesNotExist();
        assert.dom('[data-test-addon-card-disconnect]').doesNotExist();
        assert.dom('[data-test-addon-card-connect]').exists();
        await click('[data-test-addon-card-connect]');
        assert.ok(this.manager.beginAccountSetup.calledOnce);
    });

    test('it renders: enabled', async function(this: ThisTestContext, assert) {
        this.owner.unregister('service:router');
        this.owner.register('service:router', RouterStub);
        const addonObj = {
            provider: {
                id: 'box',
                name: 'Test Addon',
                iconUrl: 'https://some.url/from/addons/service/box.png',
            },
            disableProjectAddon: { perform: sinon.stub() },
            nodeAddon: { configured: true },
            isConfigured: true,
        };
        this.addon = addonObj;
        this.manager = {
            node: { id: 'testnode' },
            projectEnabledAddons: [],
            beginAccountSetup: sinon.stub(),
            listProviderConfigurations: sinon.stub(),
        };

        await render(hbs`
<AddonCard
    @addon={{this.addon}}
    @manager={{this.manager}}
/>
        `);

        assert.dom('[data-test-addon-card="Test Addon"]').exists();
        assert.dom('[data-test-addon-card-logo]').hasAttribute(
            'src', 'https://some.url/from/addons/service/box.png', 'Logo is correct',
        );
        assert.dom('[data-test-addon-card-logo]').hasAttribute('alt', 'Test Addon logo', 'Alt text is correct');
        assert.dom('[data-test-addon-card-title]').hasText('Test Addon');
        assert.dom('[data-test-addon-card-edit]').exists();
        assert.dom('[data-test-addon-card-disconnect]').exists();
        assert.dom('[data-test-addon-card-connect]').doesNotExist();

        await click('[data-test-addon-card-edit]');
        assert.ok(this.manager.listProviderConfigurations.calledOnce);
        await click('[data-test-addon-card-disconnect]');
        assert.dom('[data-test-addon-disconnect-modal-confirm]').exists();
        assert.dom('#osf-dialog-heading').hasText('Disable Add-on');
        assert.dom('[data-test-dialog] main').containsText('Are you sure you want to disable this add-on?');
        await click('[data-test-addon-disconnect-modal-confirm]');
        assert.ok(addonObj.disableProjectAddon.perform.calledOnce);
    });
});
