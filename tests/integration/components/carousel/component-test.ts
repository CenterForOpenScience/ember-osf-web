import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | carousel', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(async () => {
        await render(hbs`<Carousel as |container|>
            <container.slide data-test-carousel-slide data-test-slide-1>
                <div>
                    Test content 1
                </div>
            </container.slide>
            <container.slide data-test-carousel-slide data-test-slide-2>
                <div>
                    Test content 2
                </div>
            </container.slide>
            <container.slide data-test-carousel-slide data-test-slide-3>
                <div>
                    Test content 3
                </div>
            </container.slide>
        </Carousel>`);
    });

    test('it renders', async function(assert) {
        const carousel = this.element.querySelector('[data-test-carousel-container]') as HTMLElement;
        assert.dom('[data-test-carousel-container]').exists();
        assert.dom(carousel).exists();

        // Check that dot navigation exists
        assert.dom('[data-test-dot-navigation]').exists();
        assert.dom('[data-test-navigation-button]').exists({ count: 3 });

        // check for slides
        assert.dom('[data-test-carousel-slide]').exists({ count: 3 });

        // Check for left/right buttons
        assert.dom('[data-test-carousel-button-previous]').exists();
        assert.dom('[data-test-carousel-button-next]').exists();

        // test next button
        assert.dom('[data-test-slide-1]').exists();

        await click('[data-test-carousel-button-next]');
        assert.dom('[data-test-slide-2]').exists();
        assert.dom('[data-test-slide-2]').isVisible();
        assert.dom('[data-test-slide-1]').isNotVisible();
        assert.dom('[data-test-slide-3]').isNotVisible();

        await click('[data-test-carousel-button-next]');
        assert.dom('[data-test-slide-3]').exists();
        assert.dom('[data-test-slide-3]').isVisible();
        assert.dom('[data-test-slide-1]').isNotVisible();
        assert.dom('[data-test-slide-2]').isNotVisible();

        await click('[data-test-carousel-button-next]');
        assert.dom('[data-test-slide-1]').exists();
        assert.dom('[data-test-slide-1]').isVisible();
        assert.dom('[data-test-slide-2]').isNotVisible();
        assert.dom('[data-test-slide-3]').isNotVisible();

        // test previous button
        await click('[data-test-carousel-button-previous]');
        assert.dom('[data-test-slide-3]').exists();
        assert.dom('[data-test-slide-3]').isVisible();
        assert.dom('[data-test-slide-1]').isNotVisible();
        assert.dom('[data-test-slide-2]').isNotVisible();

        await click('[data-test-carousel-button-previous]');
        assert.dom('[data-test-slide-2]').exists();
        assert.dom('[data-test-slide-2]').isVisible();
        assert.dom('[data-test-slide-1]').isNotVisible();
        assert.dom('[data-test-slide-3]').isNotVisible();

        await click('[data-test-carousel-button-previous]');
        assert.dom('[data-test-slide-1]').exists();
        assert.dom('[data-test-slide-1]').isVisible();
        assert.dom('[data-test-slide-2]').isNotVisible();
        assert.dom('[data-test-slide-3]').isNotVisible();
    });

    test('li navigation works', async function(assert) {
        assert.dom('[data-test-dot-navigation]').exists();
        assert.dom('[data-test-navigation-button]').exists({ count: 3 });
        // slide 2
        await click('[data-test-navigation-button]:nth-of-type(2)');
        assert.dom('[data-test-slide-2]').isVisible();
        assert.dom('[data-test-slide-1]').isNotVisible();
        assert.dom('[data-test-slide-3]').isNotVisible();

        // slide 3
        await click('[data-test-navigation-button]:nth-of-type(3)');
        assert.dom('[data-test-slide-3]').isVisible();
        assert.dom('[data-test-slide-1]').isNotVisible();
        assert.dom('[data-test-slide-2]').isNotVisible();

        // slide 1
        await click('[data-test-navigation-button]:nth-of-type(1)');
        assert.dom('[data-test-slide-1]').isVisible();
        assert.dom('[data-test-slide-2]').isNotVisible();
        assert.dom('[data-test-slide-3]').isNotVisible();
    });
});
