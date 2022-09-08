import { render } from '@ember/test-helpers';
// import { pauseTest } from '@ember/test-helpers/setup-context';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';


module('Integration | Component | osf-link', hooks => {
    setupRenderingTest(hooks);

    test('it renders blocks the right way', async assert => {
        await render(hbs`
            <OsfLink
                data-test-get-started-button
                data-analytics-name='Get started button'
                class='btn btn-primary'
                local-class='startButton'
                @target='_blank'
                @href='https://osf.io'
            >
                {{t 'dashboard.getting_started'}}
            </OsfLink>
        `);
        // await pauseTest();
        assert.dom('[data-test-get-started-button]').exists();
        assert.dom('[data-test-get-started-button]').hasText('Getting Started');
        assert.dom('[data-test-get-started-button]').hasClass('btn');
        assert.dom('[data-test-get-started-button]').hasClass('btn-primary');
        assert.dom('[data-test-get-started-button][href$="https://osf.io"]').exists('The href is correct');
    });
});
