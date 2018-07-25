import { click, currentURL, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { module, test } from 'qunit';

module('Acceptance | dashboard', hooks => {
    setupApplicationTest(hooks);

    test('visiting /dashboard', async assert => {
        // A fully loaded dashboard should have no major troubles
        const currentUser = server.create('user');
        const nodes = server.createList('node', 10, {}, 'withContributors');
        server.loadFixtures('nodes');
        for (let i = 4; i < 10; i++) {
            server.create('contributor', { node: nodes[i], users: currentUser, index: 11 });
        }
        server.create('root', { currentUser });
        server.createList('institution', 20);

        await visit('/dashboard');

        assert.equal(currentURL(), '/dashboard');
        assert.found('nav.navbar');
        assert.hasText('nav.navbar .service-name', 'OSF HOME');
        assert.hasText('nav.navbar .secondary-nav-dropdown .nav-profile-name', currentUser.fullName);
        assert.notFound('img[alt*="Missing translation"]');
    });

    test('institutions carousel', async function(assert) {
        const currentUser = server.create('user');
        server.create('root', { currentUser });
        const institutions = server.createList('institution', 20);

        await visit('/dashboard');
        assert.notFound('img[alt*="Missing translation"]');
        assert.found(`[class*="InstitutionCarousel__item"] img[name*="${institutions[0].name}"]`);
        assert.found(`[class*="InstitutionCarousel__item"] a[href="/institutions/${institutions[1].id}"]`);
        let nextPageItem = this.element.querySelector(
            `[class*="InstitutionCarousel__item"] img[name*="${institutions[6].name}"]`,
        );
        // Item 6 should be in page 2 of the carousel and thus not visible
        if (nextPageItem !== null) {
            assert.equal(nextPageItem.clientWidth, 0, 'Verify that the item is invisible 1/2');
            assert.equal(nextPageItem.clientHeight, 0, 'Verify that the item is invisible 2/2');
        } else {
            assert.ok(false, 'Check for non-existence of item 6 in the institutions list');
        }

        // Click next to make item six visible
        await click('.carousel-control.right');

        // Institutions should be linked properly
        assert.found(
            `[class*="InstitutionCarousel__item"] a[href="/institutions/${institutions[6].id}"]`,
            'Institutions are linked',
        );

        // Item 6 should be visible now
        nextPageItem = this.element.querySelector(
            `[class*="InstitutionCarousel__item"] img[name*="${institutions[6].name}"]`,
        );
        if (nextPageItem !== null) {
            assert.notEqual(nextPageItem.clientWidth, 0, 'Verify that the item is visible 1/2');
            assert.notEqual(nextPageItem.clientHeight, 0, 'Verify that the item is visible 2/2');
        } else {
            assert.ok(false, 'Check for existence of item 6 in the institutions list after clicking');
        }
    });

    test('popular projects and new/noteworthy titles', async function(assert) {
        const currentUser = server.create('user');
        server.create('root', { currentUser });
        const nodes = server.createList('node', 10, {}, 'withContributors');
        server.loadFixtures('nodes');
        await visit('/dashboard');
        assert.notFound('img[alt*="Missing translation"]');
        const noteworthyTitles = this.element.querySelectorAll('[id="noteworthyList"] h5');
        const popularTitles = this.element.querySelectorAll('[id="popularList"] h5');
        const nnwNodes = nodes.slice(0, 5).map((node: any) => node.attrs.title);
        const popularNodes = nodes.slice(5, 10).map((node: any) => node.attrs.title);
        for (const noteworthyTitle of noteworthyTitles) {
            if (noteworthyTitle !== null && noteworthyTitle !== undefined) {
                assert.ok(
                    nnwNodes.includes(noteworthyTitle.innerHTML),
                    'Noteworthy title is in list of noteworthy nodes',
                );
            } else {
                assert.ok(false, 'Noteworthy title is not null or undefined');
            }
        }
        for (const popularTitle of popularTitles) {
            if (popularTitle !== null && popularTitle !== undefined) {
                assert.ok(popularNodes.includes(popularTitle.innerHTML), 'Popular title is in list of popular nodes');
            } else {
                assert.ok(false, 'Popular title is not null or undefined');
            }
        }
    });

    test('user has no projects', async assert => {
        const currentUser = server.create('user');
        server.create('root', { currentUser });
        await visit('/dashboard');
        assert.notFound('img[alt*="Missing translation"]');
        assert.includesText(
            'div[class*="quick-project"]',
            'You have no projects yet. Create a project with the button on the top right.',
        );
        const node = server.create('node', {}, 'withContributors');
        server.create('contributor', { node, users: currentUser, index: 11 });
        await visit('/dashboard');
    });

    test('user has a project', async assert => {
        const currentUser = server.create('user');
        server.create('root', { currentUser });
        const node = server.create('node', {}, 'withContributors');
        server.create('contributor', { node, users: currentUser, index: 11 });
        await visit('/dashboard');
        assert.notFound('img[alt*="Missing translation"]');
        assert.notIncludesText(
            'div[class*="quick-project"]',
            'You have no projects yet. Create a project with the button on the top right.',
        );
        assert.includesText('div[class*="quick-project"]', node.attrs.title);
    });

    test('user has many projects', async function(assert) {
        const currentUser = server.create('user');
        const nodes = server.createList('node', 30, {}, 'withContributors');
        server.loadFixtures('nodes');
        for (const node of nodes) {
            server.create('contributor', { node, users: currentUser, index: 11 });
        }
        server.create('root', { currentUser });
        await visit('/dashboard');
        assert.notFound('img[alt*="Missing translation"]');

        // There should be a control to load more projects
        assert.found('#loadMoreProjects');
        let projects = this.element.querySelectorAll('div[class*="DashboardItem"] div[class="row"]');
        assert.equal(projects.length, 10);
        await click('#loadMoreProjects');
        projects = this.element.querySelectorAll('div[class*="DashboardItem"] div[class="row"]');
        assert.equal(projects.length, 20);
        assert.found('#loadMoreProjects');
        await click('#loadMoreProjects');
        projects = this.element.querySelectorAll('div[class*="DashboardItem"] div[class="row"]');
        assert.equal(projects.length, 30);

        // All projects loaded, should not have a loading control any more
        assert.notFound('#loadMoreProjects');
    });
});
