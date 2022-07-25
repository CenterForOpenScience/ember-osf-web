import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { t } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import ResourceModel, { ResourceTypes }  from 'ember-osf-web/models/resource';

interface ResourceCardTestContext extends TestContext {
    resource: ModelInstance<ResourceModel>;
}


module('Integration | Component | ResourcesList::ResourceCard', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    test('it renders data resource', async function(this: ResourceCardTestContext, assert) {
        const mirageResource = server.create('resource', {
            resourceType: ResourceTypes.Data,
            description: 'The scription',
        });
        this.set('resource', mirageResource);
        await render(hbs`<ResourcesList::ResourceCard @resource={{this.resource}} />`);
        assert.dom('[data-test-resource-card-type]').containsText(t('osf-components.resources-list.data'));
        assert.ok(document.getElementsByTagName('img')[0].src.includes('data_small_color'), 'data icon shown');
        assert.dom('[data-test-resource-card-icon]').hasAttribute('alt', t('osf-components.resources-list.data'));
        assert.dom('[data-test-resource-card-pid-link]').hasAttribute('href', this.resource.pid, 'Links to pid');
        assert.dom('[data-test-resource-card-description]').hasText(this.resource.description, 'Description shown');
    });

    test('it renders materials resource', async function(assert) {
        const mirageResource = server.create('resource', { resourceType: ResourceTypes.Materials });
        this.set('resource', mirageResource);
        await render(hbs`<ResourcesList::ResourceCard @resource={{this.resource}} />`);
        assert.dom('[data-test-resource-card-type]').containsText(t('osf-components.resources-list.materials'));
        assert.ok(document.getElementsByTagName('img')[0].src.includes('materials_small_color'), 'material icon shown');
        assert.dom('[data-test-resource-card-icon]').hasAttribute('alt', t('osf-components.resources-list.materials'));
    });

    test('it renders anonymized view', async function(assert) {
        const mirageResource = server.create('resource', {
            resourceType: ResourceTypes.Materials,
            apiMeta: { version: '0', anonymous: true },
        });
        this.set('resource', mirageResource);
        await render(hbs`<ResourcesList::ResourceCard @resource={{this.resource}} />`);
        assert.dom('[data-test-resource-card-pid-link]').doesNotExist('pid hidden for anonymous');
        assert.ok(document.getElementsByTagName('img')[0].src.includes('materials_small_color'), 'material icon shown');
        assert.dom('[data-test-resource-card-icon]').hasAttribute('alt', t('osf-components.resources-list.materials'));
    });
});
