import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

interface Expected {
    active: number;
    inactive: number[];
}

function checkAriaSelected(assert: Assert, element: Element, slideNum: number, expectedValue: string) {
    assert.equal(
        element.querySelector(
            `[data-test-navigation-item]:nth-of-type(${slideNum})`,
        )!.getAttribute('aria-selected'),
        expectedValue,
        `aria-selected is ${expectedValue} for navigation item ${slideNum}`,
    );
}

function checkActive(assert: Assert, element: Element, expected: Expected) {
    assert.ok(
        element.querySelector(`[data-test-slide-${expected.active}]`)!.className.includes('active'),
        `slide ${expected.active} is active`,
    );
    checkAriaSelected(assert, element, expected.active, 'true');

    expected.inactive.forEach(slideNum => {
        assert.notOk(
            element.querySelector(`[data-test-slide-${slideNum}]`)!.className.includes('active'),
            `slide ${slideNum} is not active`,
        );
        checkAriaSelected(assert, element, slideNum, 'false');
    });
}

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
        checkActive(assert, this.element, { active: 1, inactive: [2, 3] });
        await click('[data-test-carousel-button-next]');
        checkActive(assert, this.element, { active: 2, inactive: [3, 1] });
        await click('[data-test-carousel-button-next]');
        checkActive(assert, this.element, { active: 3, inactive: [1, 2] });
        await click('[data-test-carousel-button-next]');
        checkActive(assert, this.element, { active: 1, inactive: [2, 3] });
    });

    test('Previous button works', async function(assert) {
        checkActive(assert, this.element, { active: 1, inactive: [2, 3] });
        await click('[data-test-carousel-button-previous]');
        checkActive(assert, this.element, { active: 3, inactive: [1, 2] });
        await click('[data-test-carousel-button-previous]');
        checkActive(assert, this.element, { active: 2, inactive: [3, 1] });
        await click('[data-test-carousel-button-previous]');
        checkActive(assert, this.element, { active: 1, inactive: [2, 3] });
    });

    test('li navigation works', async function(assert) {
        checkActive(assert, this.element, { active: 1, inactive: [2, 3] });
        await click('[data-test-navigation-item]:nth-of-type(2) > [data-test-navigation-button]');
        checkActive(assert, this.element, { active: 2, inactive: [3, 1] });
        await click('[data-test-navigation-item]:nth-of-type(3) > [data-test-navigation-button]');
        checkActive(assert, this.element, { active: 3, inactive: [1, 2] });
        await click('[data-test-navigation-item]:nth-of-type(1) > [data-test-navigation-button]');
        checkActive(assert, this.element, { active: 1, inactive: [2, 3] });
    });
});
