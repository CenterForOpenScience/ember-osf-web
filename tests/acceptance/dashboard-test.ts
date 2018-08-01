import { click, currentURL, fillIn, visit } from '@ember/test-helpers';

import { setupApplicationTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { module, test } from 'qunit';
import 'qunit-dom';

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

        assert.equal(currentURL(), '/dashboard', 'We stayed on the proper page');
        assert.found('nav.navbar');
        assert.hasText('nav.navbar .service-name', 'OSF HOME');
        assert.hasText('nav.navbar .secondary-nav-dropdown .nav-profile-name', currentUser.fullName);
        assert.notFound('img[alt*="Missing translation"]');
    });

    test('institutions carousel', async assert => {
        const currentUser = server.create('user');
        server.create('root', { currentUser });
        const institutions = server.createList('institution', 20);

        await visit('/dashboard');
        assert.notFound('img[alt*="Missing translation"]');
        assert.found(`[data-test-institution-carousel] img[name*="${institutions[0].name}"]`);
        assert.found('[data-test-institution-carousel-item="1"]');
        assert.dom('[data-test-institution-carousel-item="6"]').isNotVisible();

        // Click next to make item six visible
        await click('.carousel-control.right');

        assert.found(
            `[data-test-institution-carousel-item] a[href="/institutions/${institutions[6].id}"]`,
            'Institutions are linked properly',
        );

        assert.dom('[data-test-institution-carousel-item="6"]').isVisible();
    });

    test('popular projects and new/noteworthy titles', async assert => {
        const currentUser = server.create('user');
        server.create('root', { currentUser });
        const nodes = server.createList('node', 10, {}, 'withContributors');
        server.loadFixtures('nodes');
        await visit('/dashboard');
        assert.notFound('img[alt*="Missing translation"]');
        for (const node of nodes) {
            let projectType = 'noteworthy';
            if (node.attrs.id > 5) {
                projectType = 'popular';
            }
            assert.found(`[data-test-${projectType}-project="${node.attrs.id}"]`);
            assert.includesText(
                `[data-test-${projectType}-project="${node.attrs.id}"] [data-test-nnwp-project-title]`,
                node.attrs.title,
                `The ${projectType} project ${node.attrs.id} has correct title`,
            );
            assert.includesText(
                `[data-test-${projectType}-project="${node.attrs.id}"] [data-test-nnwp-project-description]`,
                node.attrs.description,
                `The ${projectType} project ${node.attrs.id} has correct description`,
            );
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
        assert.equal(projects.length, 10, 'Only the first page of projects loaded');
        await click('#loadMoreProjects');
        projects = this.element.querySelectorAll('div[class*="DashboardItem"] div[class="row"]');
        assert.equal(projects.length, 20, 'Only the first two pages of projects are loaded after clicking `more` once');
        assert.found('#loadMoreProjects');
        await click('#loadMoreProjects');
        projects = this.element.querySelectorAll('div[class*="DashboardItem"] div[class="row"]');
        assert.equal(projects.length, 30, 'All 30 projects are loaded after clicking `more` twice');

        // All projects loaded, should not have a loading control any more
        assert.notFound('#loadMoreProjects');
    });

    test('sorting projects', async function(assert) {
        const currentUser = server.create('user');
        server.create('root', { currentUser });
        const nodeOne = server.create(
            'node',
            { title: 'z', lastLogged: '2017-10-19T12:05:10.571Z', dateModified: '2017-10-19T12:05:10.571Z' },
        );
        const nodeTwo = server.create(
            'node',
            { title: 'az', lastLogged: '2017-10-17T12:05:10.571Z', dateModified: '2017-10-17T12:05:10.571Z' },
        );
        const nodeThree = server.create(
            'node',
            { title: 'a', lastLogged: '2017-10-18T12:05:10.571Z', dateModified: '2017-10-18T12:05:10.571Z' },
        );
        server.create(
            'contributor',
            { node: nodeOne, users: currentUser, index: 0, permission: 'admin', bibliographic: true },
        );
        server.create(
            'contributor',
            { node: nodeTwo, users: currentUser, index: 0, permission: 'admin', bibliographic: true },
        );
        server.create(
            'contributor',
            { node: nodeThree, users: currentUser, index: 0, permission: 'admin', bibliographic: true },
        );
        await visit('/dashboard');
        assert.notFound('img[alt*="Missing translation"]');

        // Default sort
        let projectTitles = this.element.querySelectorAll('.di-title>strong');
        assert.equal(projectTitles.length, 3, 'Proper number of items are in list in default sort');
        assert.equal(projectTitles[0].innerHTML, 'z', 'Default sort item 0 is in proper position');
        assert.equal(projectTitles[1].innerHTML, 'a', 'Default sort item 1 is in proper position');
        assert.equal(projectTitles[2].innerHTML, 'az', 'Default sort item 2 is in proper position');

        // Sort date ascending
        await click('#last_loggedAscendingSort');
        projectTitles = this.element.querySelectorAll('.di-title>strong');
        assert.equal(projectTitles.length, 3, 'Proper number of items are in list in date asc sort');
        assert.equal(projectTitles[0].innerHTML, 'az', 'Date asc sort item 0 is in proper position');
        assert.equal(projectTitles[1].innerHTML, 'a', 'Date asc sort item 1 is in proper position');
        assert.equal(projectTitles[2].innerHTML, 'z', 'Date asc sort item 2 is in proper position');

        // Sort date descending (should be same as default)
        await click('#last_loggedDescendingSort');
        projectTitles = this.element.querySelectorAll('.di-title>strong');
        assert.equal(projectTitles.length, 3, 'Proper number of items are in list in date desc sort');
        assert.equal(projectTitles[0].innerHTML, 'z', 'Date desc sort item 0 is in proper position');
        assert.equal(projectTitles[1].innerHTML, 'a', 'Date desc sort item 1 is in proper position');
        assert.equal(projectTitles[2].innerHTML, 'az', 'Date desc sort item 2 is in proper position');

        // Sort title ascending
        await click('#titleAscendingSort');
        projectTitles = this.element.querySelectorAll('.di-title>strong');
        assert.equal(projectTitles.length, 3, 'Proper number of items are in list in title asc sort');
        assert.equal(projectTitles[0].innerHTML, 'a', 'Title asc sort item 0 is in proper position');
        assert.equal(projectTitles[1].innerHTML, 'az', 'Title asc sort item 1 is in proper position');
        assert.equal(projectTitles[2].innerHTML, 'z', 'Title asc sort item 2 is in proper position');

        // Sort title descending
        await click('#titleDescendingSort');
        projectTitles = this.element.querySelectorAll('.di-title>strong');
        assert.equal(projectTitles.length, 3, 'Proper number of items are in list in title desc sort');
        assert.equal(projectTitles[0].innerHTML, 'z', 'Title desc sort item 0 is in proper position');
        assert.equal(projectTitles[1].innerHTML, 'az', 'Title desc sort item 1 is in proper position');
        assert.equal(projectTitles[2].innerHTML, 'a', 'Title desc sort item 2 is in proper position');
    });

    test('filtering projects', async function(assert) {
        const currentUser = server.create('user');
        server.create('root', { currentUser });
        const nodeOne = server.create(
            'node',
            { title: 'z', lastLogged: '2017-10-19T12:05:10.571Z', dateModified: '2017-10-19T12:05:10.571Z' },
        );
        const nodeTwo = server.create(
            'node',
            { title: 'az', lastLogged: '2017-10-17T12:05:10.571Z', dateModified: '2017-10-17T12:05:10.571Z' },
        );
        const nodeThree = server.create(
            'node',
            { title: 'a', lastLogged: '2017-10-18T12:05:10.571Z', dateModified: '2017-10-18T12:05:10.571Z' },
        );
        server.create(
            'contributor',
            { node: nodeOne, users: currentUser, index: 0, permission: 'admin', bibliographic: true },
        );
        server.create(
            'contributor',
            { node: nodeTwo, users: currentUser, index: 0, permission: 'admin', bibliographic: true },
        );
        server.create(
            'contributor',
            { node: nodeThree, users: currentUser, index: 0, permission: 'admin', bibliographic: true },
        );
        await visit('/dashboard');
        assert.notFound('img[alt*="Missing translation"]');

        // No filtering
        let projectTitles = this.element.querySelectorAll('.di-title>strong');
        assert.equal(projectTitles.length, 3, 'Default filtering has correct number of projects');
        assert.equal(projectTitles[0].innerHTML, 'z', 'Default filtering item 0 is correct');
        assert.equal(projectTitles[1].innerHTML, 'a', 'Default filtering item 1 is correct');
        assert.equal(projectTitles[2].innerHTML, 'az', 'Default filtering item 2 is correct');

        await fillIn('[data-test-quick-search-input]', 'z');
        projectTitles = this.element.querySelectorAll('.di-title>strong');
        assert.equal(projectTitles.length, 2, 'One character filtering has correct number of projects');
        assert.equal(projectTitles[0].innerHTML, 'z', 'One character filtering item 0 is correct');
        assert.equal(projectTitles[1].innerHTML, 'az', 'One character filtering item 1 is correct');

        await fillIn('[data-test-quick-search-input]', 'az');
        projectTitles = this.element.querySelectorAll('.di-title>strong');
        assert.equal(projectTitles.length, 1, 'Two character filtering has correct number of projects');
        assert.equal(projectTitles[0].innerHTML, 'az', 'Two character filtering item is correct');
    });
});
