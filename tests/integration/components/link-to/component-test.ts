import Service from '@ember/service';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

const routerStub = Service.extend({
    transitionTo: () => null,
    generateURL: () => 'url!',
});

module('Integration | Component | link-to', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: TestContext) {
        // The default link-to uses a super-secret private router service, not the public one
        this.owner.register('service:-routing', routerStub);
    });

    test('includes aria-label', async function(assert) {
        const linkText = 'This is a link!';
        const ariaLabel = 'This is an aria label!';
        await render(hbs`
            <LinkTo
                @route='foo'
                aria-label='This is an aria label!'
            >
                This is a link!
            </LinkTo>
        `);

        const { textContent } = this.element;
        const linkElement = this.element.getElementsByTagName('a')[0];

        assert.equal((textContent as string).trim(), linkText);
        assert.equal((linkElement as Element).getAttribute('aria-label'), ariaLabel);
    });

    test('clickAction fires', async function(assert) {
        assert.expect(1);
        this.set('clickAction', () => {
            assert.ok(true);
        });

        await render(hbs`
        <LinkTo
            @route='foo'
            {{on 'click' this.clickAction}}
        >
            This is a link!
        </LinkTo>`);

        const linkElement = this.element.getElementsByTagName('a')[0];
        await click(linkElement as Element);
    });
});
