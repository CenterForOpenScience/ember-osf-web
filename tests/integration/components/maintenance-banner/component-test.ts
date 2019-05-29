import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import hbs from 'htmlbars-inline-precompile';
import $ from 'jquery';
import { module } from 'qunit';

interface FakeAjax {
    ajax(): {
        maintenance: {
            message: string;
            level: number;
        } | null;
    };
}

module('Integration | Component | maintenance-banner', hooks => {
    setupRenderingTest(hooks);

    test('it renders no maintenance', async function(assert) {
        this.stub($ as unknown as FakeAjax, 'ajax').callsFake(() => ({
            maintenance: null,
        }));
        await render(hbs`{{maintenance-banner}}`);
        assert.dom('.alert').doesNotExist();
    });

    test('it renders maintenance message', async function(assert) {
        this.stub($ as unknown as FakeAjax, 'ajax').callsFake(() => ({
            maintenance: {
                message: 'longstringy',
                level: 1,
            },
        }));
        await render(hbs`{{maintenance-banner}}`);
        assert.dom('.alert').includesText('longstringy');
    });
});
