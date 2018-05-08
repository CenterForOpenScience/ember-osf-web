import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | node-blurb/node-icon', hooks => {
    setupRenderingTest(hooks);

    test('renders an icon', async function(assert) {
        await render(hbs`{{node-blurb/node-icon category='hypothesis'}}`);

        assert.ok(this.element.innerHTML.includes('lightbulb'));
    });

    test('render nothing when not a matching category', async function(assert) {
        await render(hbs`{{node-blurb/node-icon category='not-a-real-category'}}`);

        assert.ok(!this.element.innerHTML.includes('fa-icon'));
    });

    test('renders text-muted when needed', async function(assert) {
        await render(hbs`{{node-blurb/node-icon category='hypothesis'}}`);
        assert.ok(!this.element.innerHTML.includes('text-muted'));

        await render(hbs`{{node-blurb/node-icon category='registration'}}`);
        assert.ok(this.element.innerHTML.includes('text-muted'));
    });
});
