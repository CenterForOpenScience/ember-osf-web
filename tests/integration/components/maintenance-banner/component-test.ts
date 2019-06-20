import { render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import config from 'ember-get-config';
import { setupRenderingTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import hbs from 'htmlbars-inline-precompile';
import { module } from 'qunit';

const {
    OSF: { apiUrl },
} = config;

module('Integration | Component | maintenance-banner', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    test('it renders no maintenance', async assert => {
        server.get('/v2/status', () => ({
            meta: { version: '2.8' },
            maintenance: null,
        }));
        await render(hbs`{{maintenance-banner}}`);
        assert.dom('.alert').doesNotExist();
    });

    test('it renders maintenance message', async assert => {
        server.urlPrefix = apiUrl;
        server.namespace = '/v2';
        server.get('/status', () => ({
            meta: { version: '2.8' },
            maintenance: {
                message: 'longstringy',
                level: 1,
            },
        }));
        await render(hbs`{{maintenance-banner}}`);
        assert.dom('.alert').includesText('longstringy');
    });
});
