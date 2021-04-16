import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import config from 'ember-get-config';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

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
