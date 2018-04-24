import Service from '@ember/service';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

// Stub i18n service
const i18nStub = Service.extend({
    t(word: string) {
        const translated: { [k: string]: string } = {
            'navbar.reviews': 'My Reviewing',
            'navbar.my_quick_files': 'My Quick Files',
            'navbar.my_projects': 'My Projects',
            'navbar.search': 'Search',
            'navbar.support': 'Support',
            'navbar.donate': 'Donate',
        };
        return translated[word];
    },
});

const sessionStub = Service.extend({
    isAuthenticated: false,
});

const currentUserStub = Service.extend({
    user: Object.freeze({
        canViewReviews: false,
    }),
});

module('Integration | Component | osf-navbar/home-links', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.owner.register('service:i18n', i18nStub);
        this.owner.register('service:session', sessionStub);
        this.owner.register('service:current-user', currentUserStub);
    });

    test('it renders', async function(assert) {
        const linkTexts = () => {
            return (this.element.textContent as string)
                .split('\n')
                .map(t => t.trim())
                .filter(t => !!t);
        };

        await render(hbs`{{osf-navbar/home-links}}`);
        assert.deepEqual(linkTexts(), ['Search', 'Support', 'Donate']);

        this.owner.lookup('service:session').set('isAuthenticated', true);
        await render(hbs`{{osf-navbar/home-links}}`);
        assert.deepEqual(linkTexts(), ['My Quick Files', 'My Projects', 'Search', 'Support', 'Donate']);

        this.owner.lookup('service:current-user').set('user', { canViewReviews: true });
        await render(hbs`{{osf-navbar/home-links}}`);
        assert.deepEqual(linkTexts(), ['My Quick Files', 'My Projects', 'Search', 'Support', 'Donate']);
    });
});
