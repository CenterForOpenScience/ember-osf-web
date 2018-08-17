import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | node-blurb/node-icon', hooks => {
    setupRenderingTest(hooks);

    test('renders an icon for category hypothesis', async assert => {
        await render(hbs`{{node-blurb/node-icon category='hypothesis'}}`);
        assert.dom('svg').hasClass('fa-lightbulb');
    });
    test('renders an icon for category methods and measures', async assert => {
        await render(hbs`{{node-blurb/node-icon category='methods and measures'}}`);
        assert.dom('svg').hasClass('fa-pencil-alt');
    });
    test('renders an icon for category procedure', async assert => {
        await render(hbs`{{node-blurb/node-icon category='procedure'}}`);
        assert.dom('svg').hasClass('fa-cogs');
    });
    test('renders an icon for category instrumentation', async assert => {
        await render(hbs`{{node-blurb/node-icon category='instrumentation'}}`);
        assert.dom('svg').hasClass('fa-flask');
    });
    test('renders an icon for category data', async assert => {
        await render(hbs`{{node-blurb/node-icon category='data'}}`);
        assert.dom('svg').hasClass('fa-database');
    });
    test('renders an icon for category software', async assert => {
        await render(hbs`{{node-blurb/node-icon category='software'}}`);
        assert.dom('svg').hasClass('fa-laptop');
    });
    test('renders an icon for category project', async assert => {
        await render(hbs`{{node-blurb/node-icon category='project'}}`);
        assert.dom('svg').hasClass('fa-cube');
    });
    test('renders an icon for category analysis', async assert => {
        await render(hbs`{{node-blurb/node-icon category='analysis'}}`);
        assert.dom('svg').hasClass('fa-chart-bar');
    });
    test('renders an icon for category communication', async assert => {
        await render(hbs`{{node-blurb/node-icon category='communication'}}`);
        assert.dom('svg').hasClass('fa-comment');
    });
    test('renders an icon for category other', async assert => {
        await render(hbs`{{node-blurb/node-icon category='other'}}`);
        assert.dom('svg').hasClass('fa-th-large');
    });
    test('renders an icon for category collection', async assert => {
        await render(hbs`{{node-blurb/node-icon category='collection'}}`);
        assert.dom('svg').hasClass('fa-cubes');
    });
    test('renders an icon for category smartCollection', async assert => {
        await render(hbs`{{node-blurb/node-icon category='smartCollection'}}`);
        assert.dom('svg').hasClass('fa-certificate');
    });
    test('renders an icon for category registration', async assert => {
        await render(hbs`{{node-blurb/node-icon category='registration'}}`);
        assert.dom('svg').hasClass('fa-th-list');
    });
    test('renders an icon for category component', async assert => {
        await render(hbs`{{node-blurb/node-icon category='component'}}`);
        assert.dom('svg').hasClass('fa-th-large');
    });
    test('renders an icon for category registeredComponent', async assert => {
        await render(hbs`{{node-blurb/node-icon category='registeredComponent'}}`);
        assert.dom('svg').hasClass('fa-th-large');
    });
    test('renders an icon for category link', async assert => {
        await render(hbs`{{node-blurb/node-icon category='link'}}`);
        assert.dom('svg').hasClass('fa-link');
    });
    test('renders an icon for category preprint', async assert => {
        await render(hbs`{{node-blurb/node-icon category='preprint'}}`);
        assert.dom('svg').hasClass('fa-file-alt');
    });

    test('render circle-notch when not a matching category', async assert => {
        await render(hbs`{{node-blurb/node-icon category='xyzzyplugh'}}`);
        assert.dom('svg').hasClass('fa-circle-notch');
    });

    test('renders text-muted when needed', async function(assert) {
        await render(hbs`{{node-blurb/node-icon category='hypothesis'}}`);
        assert.ok(!this.element.innerHTML.includes('text-muted'));

        await render(hbs`{{node-blurb/node-icon category='registration'}}`);
        assert.ok(this.element.innerHTML.includes('text-muted'));
    });
});
