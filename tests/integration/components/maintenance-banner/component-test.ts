import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import hbs from 'htmlbars-inline-precompile';
import $ from 'jquery';
import { module } from 'qunit';

module('Integration | Component | maintenance-banner', hooks => {
    setupRenderingTest(hooks);

    test('it renders no maintenance', async function(assert) {
        this.stub($, 'ajax').callsFake(() => ({
            maintenance: null,
        }));
        await render(hbs`{{maintenance-banner}}`);
        assert.notFound('.alert');
    });

    test('it renders maintenance message', async function(assert) {
        this.stub($, 'ajax').callsFake(() => ({
            maintenance: {
                message: 'longstringy',
                level: 1,
            },
        }));
        await render(hbs`{{maintenance-banner}}`);
        assert.includesText('.alert', 'longstringy');
    });
});
