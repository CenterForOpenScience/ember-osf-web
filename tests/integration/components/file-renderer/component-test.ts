import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupIntl } from 'ember-intl/test-support';
import config from 'ember-osf-web/config/environment';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

const { OSF: { renderUrl } } = config;

module('Integration | Component | file-renderer', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    test('file rendering defaults', async function(assert) {
        const download = this.set('download', 'http://cos.io/');

        await render(hbs`
            {{file-renderer download=this.download}}
        `);

        const iframe = this.element.querySelector('iframe') as HTMLIFrameElement;

        iframe.dispatchEvent(new Event('load'));

        await settled();

        assert.equal(iframe.getAttribute('height'), '100%');
        assert.equal(iframe.getAttribute('width'), '100%');
        assert.equal(
            iframe.getAttribute('src'),
            `${renderUrl}?url=${encodeURIComponent(`${download}?direct=&mode=render&allowCommenting=false`)}`,
        );
    });

    test('specify file rendering parameters', async function(assert) {
        this.setProperties({
            download: 'http://cos.io/',
            height: 500,
            width: 500,
            allowCommenting: true,
        });

        await render(hbs`
            {{file-renderer download=this.download height=this.height width=this.width 
                allowCommenting=this.allowCommenting}}
        `);

        const iframe = this.element.querySelector('iframe') as HTMLIFrameElement;

        iframe.dispatchEvent(new Event('load'));

        await settled();

        assert.equal(iframe.getAttribute('height'), '500');
        assert.equal(iframe.getAttribute('width'), '500');
        assert.equal(
            iframe.getAttribute('src'),
            `${renderUrl}?url=${encodeURIComponent('http://cos.io/?direct=&mode=render&allowCommenting=true')}`,
        );
    });
});
