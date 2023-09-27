import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import styles from 'osf-components/components/button/styles';

module('Osf Components | Integration | Component | Button', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        await render(hbs`
            <Button>
                Click me
            </Button>
        `);

        assert.dom('button').exists();
        assert.dom('button').hasText('Click me');
        assert.dom('button').hasAttribute('type', 'button');
    });

    test('it accepts a layout prop', async function(assert) {
        await render(hbs`
            <Button
                @layout='small'
            >
                Click me
            </Button>
        `);

        assert.dom('button').hasClass(
            styles.SmallButton,
            'Button should have a "small" class when small is passed in as layout',
        );
        assert.dom('button').hasClass(
            styles.SecondaryButton,
            'Button should have a secondary type by default',
        );
    });

    test('it accepts a type prop', async function(assert) {
        await render(hbs`
            <Button
                @type='primary'
            >
                Click me
            </Button>
        `);

        assert.dom('button').hasClass(
            styles.PrimaryButton,
            'Button should have a "primary" class when primary is passed in as type',
        );
        assert.dom('button').hasClass(
            styles.MediumButton,
            'Button should have a medium layout by default',
        );
    });
});
