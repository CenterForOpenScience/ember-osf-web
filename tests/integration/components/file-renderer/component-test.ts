import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import config from 'ember-get-config';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

const { OSF: { renderUrl } } = config;

module('Integration | Component | file-renderer', hooks => {
    setupRenderingTest(hooks);

    test('file rendering defaults', async function(assert) {
        const download = this.set('download', 'someTruthyValue');

        await render(hbs`
            {{file-renderer download=download}}
        `);

        const iframe = this.element.querySelector('iframe') as HTMLIFrameElement;

        iframe.dispatchEvent(new Event('load'));

        await settled();

        assert.equal(iframe.getAttribute('height'), '100%');
        assert.equal(iframe.getAttribute('width'), '100%');
        assert.equal(
            iframe.getAttribute('src'),
            `${renderUrl}?url=${encodeURIComponent(`${download}?direct=&mode=render`)}`,
        );
    });

    test('specify file rendering parameters', async function(assert) {
        this.setProperties({
            download: 'http://cos.io/',
            height: 500,
            width: 500,
        });

        await render(hbs`
            {{file-renderer download=download height=height width=width}}
        `);

        const iframe = this.element.querySelector('iframe') as HTMLIFrameElement;

        iframe.dispatchEvent(new Event('load'));

        await settled();

        assert.equal(iframe.getAttribute('height'), '500');
        assert.equal(iframe.getAttribute('width'), '500');
        assert.equal(
            iframe.getAttribute('src'),
            `${renderUrl}?url=${encodeURIComponent('http://cos.io/?direct=&mode=render')}`,
        );
    });
});
