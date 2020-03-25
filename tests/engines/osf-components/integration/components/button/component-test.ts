import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

/* tslint:disable:only-arrow-functions */
module('Osf Components | Integration | Component | Button', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async assert => {
        await render(hbs`
            <Button>
                Click me
            </Button>
        `);

        assert.dom('button').exists();
        assert.dom('button').hasText('Click me');
        assert.dom('button').hasAttribute('type', 'button');
    });

    test('it accepts a layout prop', async assert => {
        await render(hbs`
            <Button
                @layout='small'
            >
                Click me
            </Button>
        `);

        assert.dom('button').hasClass(
            'small',
            'Button should have a "small" class when small is passed in as layout',
        );
        assert.dom('button').hasClass(
            'secondary',
            'Button should have a secondary type by default',
        );
    });

    test('it accepts a type prop', async assert => {
        await render(hbs`
            <Button
                @type='primary'
            >
                Click me
            </Button>
        `);

        assert.dom('button').hasClass(
            'primary',
            'Button should have a "primary" class when primary is passed in as type',
        );
        assert.dom('button').hasClass(
            'medium',
            'Button should have a medium layout by default',
        );
    });
});
