import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import { setBreakpoint } from 'ember-responsive/test-support';

module('Integration | Helper | is-mobile', function(hooks) {
    setupRenderingTest(hooks);

    // Replace this with your real tests.
    test('it renders', async function(assert) {
        setBreakpoint('mobile');

        await render(hbs`
<div data-test-div>{{if (is-mobile) 'mobile' 'not-mobile'}}</div>`);

        assert.dom('[data-test-div]').hasText('mobile');

        setBreakpoint('desktop');
        assert.dom('[data-test-div]').hasText('not-mobile');
    });
});
