import { click, render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | carousel', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(async () => {
        await render(hbs`<Carousel as |container|>
            <container.slide data-test-carousel-slide data-test-slide-1>
                <div>
                    Test content
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

    test('it renders', async assert => {
        assert.dom('[data-test-carousel-container]').exists();

        // Check that dot navigation exists
        assert.dom('[data-test-dot-navigation]').exists();
        assert.dom('[data-test-navigation-item]').exists({ count: 3 });

        // Check for left/right buttons
        assert.dom('[data-test-carousel-button-previous]').exists();
        assert.dom('[data-test-carousel-button-next]').exists();

        // Check for slides
        assert.dom('[data-test-carousel-slide]').exists({ count: 3 });
    });

    test('Next button works', async function(assert) {
        assert.dom('[data-test-slide-1]').hasClass('active');
        assert.dom('[data-test-slide-2]').doesNotHaveClass('active');
        assert.dom('[data-test-slide-3]').doesNotHaveClass('active');
        assert.equal(this.element.querySelector('[data-test-navigation-item]:first-of-type')!
            .getAttribute('aria-selected'), 'true');

        await click('[data-test-carousel-button-next]');

        assert.dom('[data-test-slide-1]').doesNotHaveClass('active');
        assert.dom('[data-test-slide-2]').hasClass('active');
        assert.dom('[data-test-slide-3]').doesNotHaveClass('active');
        assert.equal(this.element.querySelector('[data-test-navigation-item]:nth-of-type(2)')!
            .getAttribute('aria-selected'), 'true');

        await click('[data-test-carousel-button-next]');

        assert.dom('[data-test-slide-1]').doesNotHaveClass('active');
        assert.dom('[data-test-slide-2]').doesNotHaveClass('active');
        assert.dom('[data-test-slide-3]').hasClass('active');
        assert.equal(this.element.querySelector('[data-test-navigation-item]:nth-of-type(3')!
            .getAttribute('aria-selected'), 'true');

        await click('[data-test-carousel-button-next]');

        assert.dom('[data-test-slide-1]').hasClass('active');
        assert.dom('[data-test-slide-2]').doesNotHaveClass('active');
        assert.dom('[data-test-slide-3]').doesNotHaveClass('active');
        assert.equal(this.element.querySelector('[data-test-navigation-item]:first-of-type')!
            .getAttribute('aria-selected'), 'true');
    });

    test('Previous button works', async function(assert) {
        assert.dom('[data-test-slide-1]').hasClass('active');
        assert.dom('[data-test-slide-2]').doesNotHaveClass('active');
        assert.dom('[data-test-slide-3]').doesNotHaveClass('active');
        assert.equal(this.element.querySelector('[data-test-navigation-item]:first-of-type')!
            .getAttribute('aria-selected'), 'true');

        await click('[data-test-carousel-button-previous]');

        assert.dom('[data-test-slide-1]').doesNotHaveClass('active');
        assert.dom('[data-test-slide-2]').doesNotHaveClass('active');
        assert.dom('[data-test-slide-3]').hasClass('active');
        assert.equal(this.element.querySelector('[data-test-navigation-item]:nth-of-type(3)')!
            .getAttribute('aria-selected'), 'true');

        await click('[data-test-carousel-button-previous]');

        assert.dom('[data-test-slide-1]').doesNotHaveClass('active');
        assert.dom('[data-test-slide-2]').hasClass('active');
        assert.dom('[data-test-slide-3]').doesNotHaveClass('active');
        assert.equal(this.element.querySelector('[data-test-navigation-item]:nth-of-type(2)')!
            .getAttribute('aria-selected'), 'true');

        await click('[data-test-carousel-button-previous]');

        assert.dom('[data-test-slide-1]').hasClass('active');
        assert.dom('[data-test-slide-2]').doesNotHaveClass('active');
        assert.dom('[data-test-slide-3]').doesNotHaveClass('active');
        assert.equal(this.element.querySelector('[data-test-navigation-item]:first-of-type')!
            .getAttribute('aria-selected'), 'true');
    });

    test('li navigation works', async function(assert) {
        assert.dom('[data-test-slide-1]').hasClass('active');
        assert.dom('[data-test-slide-2]').doesNotHaveClass('active');
        assert.dom('[data-test-slide-3]').doesNotHaveClass('active');
        assert.equal(this.element.querySelector('[data-test-navigation-item]:first-of-type')!
            .getAttribute('aria-selected'), 'true');

        await click('[data-test-navigation-item]:nth-of-type(2) > [data-test-navigation-button]');

        assert.dom('[data-test-slide-1]').doesNotHaveClass('active');
        assert.dom('[data-test-slide-2]').hasClass('active');
        assert.dom('[data-test-slide-3]').doesNotHaveClass('active');
        assert.equal(this.element.querySelector('[data-test-navigation-item]:nth-of-type(2)')!
            .getAttribute('aria-selected'), 'true');

        await click('[data-test-navigation-item]:nth-of-type(3) > [data-test-navigation-button]');

        assert.dom('[data-test-slide-1]').doesNotHaveClass('active');
        assert.dom('[data-test-slide-2]').doesNotHaveClass('active');
        assert.dom('[data-test-slide-3]').hasClass('active');
        assert.equal(this.element.querySelector('[data-test-navigation-item]:nth-of-type(3)')!
            .getAttribute('aria-selected'), 'true');

        await click('[data-test-navigation-item]:first-of-type > [data-test-navigation-button]');

        assert.dom('[data-test-slide-1]').hasClass('active');
        assert.dom('[data-test-slide-2]').doesNotHaveClass('active');
        assert.dom('[data-test-slide-3]').doesNotHaveClass('active');
        assert.equal(this.element.querySelector('[data-test-navigation-item]:first-of-type')!
            .getAttribute('aria-selected'), 'true');
    });
});
