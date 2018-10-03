import { click, currentURL, fillIn, visit } from '@ember/test-helpers';

import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
import { module, test } from 'qunit';

import config from 'ember-get-config';

const {
    dashboard: {
        noteworthyNode,
        popularNode,
    },
} = config;

module('Acceptance | OSF | dashboard', hooks => {
    setupEngineApplicationTest(hooks, 'osf');
    setupMirage(hooks);

    test('visiting /dashboard', async assert => {
        // A fully loaded dashboard should have no major troubles
        const currentUser = server.create('user', 'loggedIn');
        const nodes = server.createList('node', 10, {}, 'withContributors');
        server.create('node', {
            id: noteworthyNode,
            linkedNodes: nodes.slice(0, 5),
            title: 'NNW',
        });
        server.create('node', {
            id: popularNode,
            linkedNodes: nodes.slice(5, 10),
            title: 'Popular',
        });
        for (const node of nodes.slice(4, 10)) {
            server.create('contributor', { node, users: currentUser, index: 11 });
        }
        server.createList('institution', 20);

        await visit('/dashboard');

        assert.equal(currentURL(), '/dashboard', 'We stayed on the proper page');
        assert.dom('nav.navbar').exists();
        assert.dom('nav.navbar .service-name').hasText('OSF HOME');
        assert.dom('nav.navbar .secondary-nav-dropdown .nav-profile-name')
            .hasText(currentUser.fullName, 'User\'s name is in navbar');
        assert.dom('img[alt*="Missing translation"]').doesNotExist();
    });

    test('institutions carousel', async assert => {
        server.create('user', 'loggedIn');
        const institutions = server.createList('institution', 20);

        await visit('/dashboard');
        assert.dom('img[alt*="Missing translation"]').doesNotExist();
        assert.dom(`[data-test-institution-carousel] img[name*="${institutions[0].name}"]`).exists();
        assert.dom('[data-test-institution-carousel-item="1"]').exists();
        assert.dom('[data-test-institution-carousel-item="6"]').isNotVisible();

        // Click next to make item six visible
        await click('.carousel-control.right');

        assert.dom(`[data-test-institution-carousel-item] a[href="/institutions/${institutions[6].id}"]`)
            .exists('Institutions are linked properly');

        assert.dom('[data-test-institution-carousel-item="6"]').isVisible();
    });

    test('popular projects and new/noteworthy titles', async assert => {
        server.create('user', 'loggedIn');
        const nodes = server.createList('node', 10, {}, 'withContributors');
        server.create('node', {
            id: noteworthyNode,
            linkedNodes: nodes.slice(0, 5),
            title: 'NNW',
        });
        server.create('node', {
            id: popularNode,
            linkedNodes: nodes.slice(5, 10),
            title: 'Popular',
        });
        await visit('/dashboard');
        assert.dom('img[alt*="Missing translation"]').doesNotExist();
        let i = 0;
        for (const node of nodes) {
            const { id, title, description } = node.attrs;
            let projectType = 'noteworthy';
            if (i > 4) {
                projectType = 'popular';
            }
            i++;
            assert.dom(`[data-test-${projectType}-project="${id}"]`)
                .exists(`The ${projectType} project ${id} exists`);
            assert.dom(`[data-test-${projectType}-project="${id}"] [data-test-nnwp-project-title]`)
                .includesText(title, `The ${projectType} project ${id} has correct title`);
            assert.dom(`[data-test-${projectType}-project="${id}"] [data-test-nnwp-project-description]`)
                .includesText(description, `The ${projectType} project ${id} has correct description`);
        }
    });

    test('user has no projects', async assert => {
        server.create('user', 'loggedIn');
        await visit('/dashboard');
        assert.dom('img[alt*="Missing translation"]').doesNotExist();
        assert.dom('div[class*="quick-project"]')
            .includesText('You have no projects yet. Create a project with the button on the top right.');
    });

    test('user has a project', async assert => {
        const currentUser = server.create('user', 'loggedIn');
        const node = server.create('node', {}, 'withContributors');
        server.create('contributor', { node, users: currentUser, index: 11 });
        await visit('/dashboard');
        assert.dom('img[alt*="Missing translation"]').doesNotExist();
        assert.dom('div[class*="quick-project"]')
            .doesNotIncludeText('You have no projects yet. Create a project with the button on the top right.');
        assert.dom('div[class*="quick-project"]').includesText(node.attrs.title);
    });

    test('user has many projects', async function(assert) {
        const currentUser = server.create('user', 'loggedIn');
        const nodes = server.createList('node', 30, {}, 'withContributors');
        server.create('node', {
            id: noteworthyNode,
            linkedNodes: nodes.slice(0, 5),
            title: 'NNW',
        });
        server.create('node', {
            id: popularNode,
            linkedNodes: nodes.slice(5, 10),
            title: 'Popular',
        });
        for (const node of nodes) {
            server.create('contributor', { node, users: currentUser, index: 11 });
        }
        await visit('/dashboard');
        assert.dom('img[alt*="Missing translation"]').doesNotExist();

        assert.dom('[data-test-load-more]').exists('The control to load more projects exists');
        let projects = this.element.querySelectorAll('div[class*="DashboardItem"] div[class="row"]');
        assert.equal(projects.length, 10, 'Only the first page of projects loaded');
        await click('[data-test-load-more]');
        projects = this.element.querySelectorAll('div[class*="DashboardItem"] div[class="row"]');
        assert.equal(projects.length, 20, 'Only the first two pages of projects are loaded after clicking `more` once');
        assert.dom('[data-test-load-more]').exists('The control to load more projects still exists');
        await click('[data-test-load-more]');
        projects = this.element.querySelectorAll('div[class*="DashboardItem"] div[class="row"]');
        assert.equal(projects.length, 30, 'All 30 projects are loaded after clicking `more` twice');

        assert.dom('[data-test-load-more]')
            .doesNotExist('The control to load more projects is gone after all projects are loaded');
    });

    test('sorting projects', async function(assert) {
        const currentUser = server.create('user', 'loggedIn');
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
        assert.dom('img[alt*="Missing translation"]').doesNotExist();

        // Default sort
        let projectTitles = this.element.querySelectorAll('[data-test-dashboard-item-title]');
        assert.equal(projectTitles.length, 3, 'Proper number of items are in list in default sort');
        assert.dom(projectTitles[0]).hasText('z', 'Default sort item 0 is in proper position');
        assert.dom(projectTitles[1]).hasText('a', 'Default sort item 1 is in proper position');
        assert.dom(projectTitles[2]).hasText('az', 'Default sort item 2 is in proper position');

        // Sort date ascending
        await click('#last_loggedAscendingSort');
        projectTitles = this.element.querySelectorAll('[data-test-dashboard-item-title]');
        assert.equal(projectTitles.length, 3, 'Proper number of items are in list in date asc sort');
        assert.dom(projectTitles[0]).hasText('az', 'Date asc sort item 0 is in proper position');
        assert.dom(projectTitles[1]).hasText('a', 'Date asc sort item 1 is in proper position');
        assert.dom(projectTitles[2]).hasText('z', 'Date asc sort item 2 is in proper position');

        // Sort date descending (should be same as default)
        await click('#last_loggedDescendingSort');
        projectTitles = this.element.querySelectorAll('[data-test-dashboard-item-title]');
        assert.equal(projectTitles.length, 3, 'Proper number of items are in list in date desc sort');
        assert.dom(projectTitles[0]).hasText('z', 'Date desc sort item 0 is in proper position');
        assert.dom(projectTitles[1]).hasText('a', 'Date desc sort item 1 is in proper position');
        assert.dom(projectTitles[2]).hasText('az', 'Date desc sort item 2 is in proper position');

        // Sort title ascending
        await click('#titleAscendingSort');
        projectTitles = this.element.querySelectorAll('[data-test-dashboard-item-title]');
        assert.equal(projectTitles.length, 3, 'Proper number of items are in list in title asc sort');
        assert.dom(projectTitles[0]).hasText('a', 'Title asc sort item 0 is in proper position');
        assert.dom(projectTitles[1]).hasText('az', 'Title asc sort item 1 is in proper position');
        assert.dom(projectTitles[2]).hasText('z', 'Title asc sort item 2 is in proper position');

        // Sort title descending
        await click('#titleDescendingSort');
        projectTitles = this.element.querySelectorAll('[data-test-dashboard-item-title]');
        assert.equal(projectTitles.length, 3, 'Proper number of items are in list in title desc sort');
        assert.dom(projectTitles[0]).hasText('z', 'Title desc sort item 0 is in proper position');
        assert.dom(projectTitles[1]).hasText('az', 'Title desc sort item 1 is in proper position');
        assert.dom(projectTitles[2]).hasText('a', 'Title desc sort item 2 is in proper position');
    });

    test('filtering projects', async function(assert) {
        const currentUser = server.create('user', 'loggedIn');
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
        assert.dom('img[alt*="Missing translation"]').doesNotExist();

        // No filtering
        let projectTitles = this.element.querySelectorAll('[data-test-dashboard-item-title]');
        assert.equal(projectTitles.length, 3, 'Not filtering has correct number of projects');
        assert.dom(projectTitles[0]).hasText('z', 'Not filtering item 0 is correct');
        assert.dom(projectTitles[1]).hasText('a', 'Not filtering item 1 is correct');
        assert.dom(projectTitles[2]).hasText('az', 'Not filtering item 2 is correct');

        await fillIn('[data-test-quick-search-input]', 'z');
        projectTitles = this.element.querySelectorAll('[data-test-dashboard-item-title]');
        assert.equal(projectTitles.length, 2, 'One character filtering has correct number of projects');
        assert.dom(projectTitles[0]).hasText('z', 'One character filtering item 0 is correct');
        assert.dom(projectTitles[1]).hasText('az', 'One character filtering item 1 is correct');

        await fillIn('[data-test-quick-search-input]', 'az');
        projectTitles = this.element.querySelectorAll('[data-test-dashboard-item-title]');
        assert.equal(projectTitles.length, 1, 'Two character filtering has correct number of projects');
        assert.dom(projectTitles[0]).hasText('az', 'Two character filtering item is correct');
    });
});
