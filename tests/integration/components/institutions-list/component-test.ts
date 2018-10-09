import { render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | institutions-list', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    test('no institutions', async function(assert) {
        const institutions = server.createList('institution', 0);

        this.set('institutions', institutions);

        await render(hbs`{{institutions-list institutions=institutions}}`);

        assert.dom('[data-test-institutions-list]').exists();
    });

    test('many institutions', async function(assert) {
        const institutions = server.createList('institution', 10);

        this.set('institutions', institutions);

        await render(hbs`{{institutions-list institutions=institutions}}`);

        assert.dom('[data-test-institutions-list]').exists();
        institutions.forEach(institution =>
            assert.dom(`[data-test-institution-list-institution="${institution.name}"]`).exists());
    });
});
