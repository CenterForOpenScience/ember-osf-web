import { click as untrackedClick, currentRouteName } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { module, test } from 'qunit';

import {
    draftRegisterNode,
    draftRegisterNodeMultiple,
    registerNode,
    registerNodeMultiple,
} from 'ember-osf-web/mirage/helpers';
import { click, currentURL, setupOSFApplicationTest, visit } from 'ember-osf-web/tests/helpers';

import { Permission } from 'ember-osf-web/models/osf-model';

module('Acceptance | guid-node/registrations', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('logged out, no registrations', async assert => {
        const node = server.create('node', { id: 'decaf', currentUserPermissions: [] });

        const url = `/${node.id}/registrations`;

        await visit(url);

        assert.equal(currentURL(), url, `We are on ${url}`);
        assert.equal(currentRouteName(), 'guid-node.registrations', 'We are at guid-node.registrations');
        await percySnapshot(assert);

        assert.dom('[data-test-new-registration-button]').doesNotExist();

        assert.dom('[data-test-registrations-pane]').includesText(
            'There have been no completed registrations of this project.',
        );
    });

    test('logged out, 1 registration', async assert => {
        const node = server.create('node', { id: 'decaf' });

        const title = 'Test Title';

        const registration = server.create('registration', { title, registeredFrom: node });
        const contributorUser = server.create('user');
        server.create('contributor', { node: registration, users: contributorUser });

        const url = `/${node.id}/registrations`;

        await visit(url);

        assert.equal(currentURL(), url, `We are on ${url}`);

        assert.dom('[data-test-new-registration-button]').doesNotExist();

        assert.dom('[data-test-node-card]').exists({ count: 1 });

        assert.dom('[data-test-node-card-heading]').includesText(title);
    });

    test('logged in admin, no registrations', async assert => {
        server.create('user', 'loggedIn');

        const node = server.create('node', { id: 'decaf', currentUserPermissions: [Permission.Admin] });

        const url = `/${node.id}/registrations`;

        await visit(url);

        assert.equal(currentURL(), url, `We are on ${url}`);

        assert.dom('[data-test-new-registration-button]').exists({ count: 1 });

        assert.dom('[data-test-registrations-pane]').includesText(
            'There have been no completed registrations of this project.',
        );

        assert.dom('[data-test-new-registration-button]').exists();

        await untrackedClick('[data-test-registrations-container] a[href="#drafts"]');

        assert.dom('[data-test-registrations-pane]').isNotVisible();
        assert.dom('[data-test-draft-registrations-pane]').isVisible();

        assert.dom('[data-test-draft-registrations-pane]').includesText(
            'There are no draft registrations of this project.',
        );
    });

    test('logged in admin, 1 registration', async assert => {
        const contributorUser = server.create('user', 'loggedIn');

        const node = server.create('node', {
            id: 'decaf',
            title: 'Test Title',
            currentUserPermissions: [Permission.Admin],
        });

        server.create('contributor', { node, users: contributorUser });

        server.loadFixtures('registration-schemas');
        const registrationSchemaName = 'Prereg Challenge';
        const registrationSchema = server.schema.registrationSchemas.all().models.filter(schema =>
            schema.name === registrationSchemaName)[0];
        const registrationTitle = 'Registration Title';
        const registeredMeta = {
            q1: { comments: [], value: registrationTitle, extra: [] },
        };
        registerNode(server, node, { registrationSchema, registeredMeta });

        const url = `/${node.id}/registrations`;

        await visit(url);

        assert.equal(currentURL(), url, `We are on ${url}`);

        assert.dom('[data-test-new-registration-button]').exists({ count: 1 });

        assert.dom('[data-test-node-card]').exists({ count: 1 });

        assert.dom('[data-test-node-card-heading]').includesText(node.title);

        assert.dom('[data-test-node-card-body]').includesText(registrationSchemaName);

        assert.dom('[data-test-node-card-body]').includesText(registrationTitle);

        await untrackedClick('[data-test-registrations-container] a[href="#drafts"]');

        assert.dom('[data-test-registrations-pane]').isNotVisible();
        assert.dom('[data-test-draft-registrations-pane]').isVisible();

        assert.dom('[data-test-draft-registrations-pane]').includesText(
            'There are no draft registrations of this project.',
        );
    });

    test('logged in admin, 12 registrations', async assert => {
        const contributorUser = server.create('user', 'loggedIn');

        const node = server.create('node', {
            id: 'decaf',
            title: 'Test Title',
            currentUserPermissions: [Permission.Admin],
        });

        server.create('contributor', { node, users: contributorUser });

        server.loadFixtures('registration-schemas');
        const registrationSchema = server.schema.registrationSchemas.all().models[0];

        registerNodeMultiple(server, node, 12, { registrationSchema }, 'withArbitraryState');

        const url = `/${node.id}/registrations`;

        await visit(url);

        assert.equal(currentURL(), url, `We are on ${url}`);

        assert.dom('[data-test-new-registration-button]').exists({ count: 1 });

        assert.dom('[data-test-node-card]').exists({ count: 10 });

        assert.dom('[data-test-node-card]').includesText(node.title);
        await percySnapshot(assert);

        await click('[data-analytics-name="Pagination next"]');

        assert.dom('[data-test-node-card]').exists({ count: 2 });

        assert.dom('[data-test-node-card]').includesText(node.title);

        await untrackedClick('[data-test-registrations-container] a[href="#drafts"]');

        assert.dom('[data-test-registrations-pane]').isNotVisible();
        assert.dom('[data-test-draft-registrations-pane]').isVisible();

        assert.dom('[data-test-draft-registrations-pane]').includesText(
            'There are no draft registrations of this project.',
        );
    });

    test('logged in admin, 1 draft registration', async assert => {
        const initiator = server.create('user', 'loggedIn');

        const node = server.create('node', {
            id: 'decaf',
            currentUserPermissions: [Permission.Admin],
        });

        server.loadFixtures('registration-schemas');

        const registrationSchema = server.schema.registrationSchemas.all().models.filter(schema =>
            schema.name === 'Prereg Challenge')[0];

        const registrationMetadata = {
            q1: { comments: [], value: 'Registration Title', extra: [] },
        };

        draftRegisterNode(server, node, { initiator, registrationSchema, registrationMetadata });

        const url = `/${node.id}/registrations`;

        await visit(url);

        assert.equal(currentURL(), url, `We are on ${url}`);

        assert.dom('[data-test-new-registration-button]').exists({ count: 1 });

        await untrackedClick('[data-test-registrations-container] a[href="#drafts"]');

        assert.dom('[data-test-draft-registrations-pane]').isVisible();

        assert.dom('[data-test-draft-registrations-pane]').doesNotIncludeText(
            'There are no draft registrations of this project.',
        );

        assert.dom('[data-test-draft-registration-card]').exists({ count: 1 });

        assert.dom('[data-test-draft-registration-card-title]').includesText(
            'Prereg Challenge',
        );

        assert.dom('[data-test-draft-registration-card-progress-bar]').exists({ count: 1 });

        const progressBarElement =
            document.querySelector('[data-test-draft-registration-card-progress-bar] .progress-bar') as HTMLElement;

        assert.ok(
            parseFloat(progressBarElement.style.width ? progressBarElement.style.width : '') > 0,
            'Progress bar shows progress',
        );
    });

    test('logged in admin, 12 draft registrations', async assert => {
        const initiator = server.create('user', 'loggedIn');

        const node = server.create('node', {
            id: 'decaf',
            currentUserPermissions: [Permission.Admin],
        });

        server.loadFixtures('registration-schemas');

        draftRegisterNodeMultiple(server, node, 12, { initiator });

        const url = `/${node.id}/registrations`;

        await visit(url);

        assert.equal(currentURL(), url, `We are on ${url}`);

        assert.dom('[data-test-new-registration-button]').exists({ count: 1 });

        await untrackedClick('[data-test-registrations-container] a[href="#drafts"]');

        assert.dom('[data-test-draft-registrations-pane]').isVisible();

        assert.dom('[data-test-draft-registrations-pane]').doesNotIncludeText(
            'There are no draft registrations of this project.',
        );

        assert.dom('[data-test-draft-registration-card]').exists({ count: 10 });

        await click('[data-analytics-name="Pagination next"]');

        assert.dom('[data-test-draft-registration-card]').exists({ count: 2 });
        await percySnapshot(assert);
    });

    test('logged in admin, new registration', async assert => {
        server.create('user', 'loggedIn');

        const node = server.create('node', { id: 'decaf', currentUserPermissions: [Permission.Admin] });

        server.loadFixtures('registration-schemas');

        const url = `/${node.id}/registrations`;

        await visit(url);

        assert.equal(currentURL(), url, `We are on ${url}`);

        await click('[data-test-new-registration-button]');
        await percySnapshot(assert);

        assert.dom('[data-test-new-registration-modal-body]').isVisible();

        assert.dom('[data-test-new-registration-modal-header]').includesText('Register');

        assert.dom('[data-test-new-registration-modal-body]').includesText(
            'Continue your registration by selecting a registration form:',
        );

        server.schema.registrationSchemas.all().models.forEach(schema =>
            assert.dom('[data-test-new-registration-modal-body]').includesText(schema.name));

        await click('[data-test-new-registration-modal-cancel-button]');

        assert.dom('[data-test-new-registration-modal-body]').isNotVisible();
    });

    test('logged in admin, prereg challenge modal', async assert => {
        server.create('user', 'loggedIn');

        const node = server.create('node', { id: 'decaf', currentUserPermissions: [Permission.Admin] });

        server.loadFixtures('registration-schemas');

        const url = `/${node.id}/registrations`;

        await visit(url);

        assert.equal(currentURL(), url, `We are on ${url}`);

        // Test prereg challenge modal twice to make sure state is reset
        for (let i = 0; i < 2; i++) {
            await click('[data-test-new-registration-button]');
            await untrackedClick('[data-test-new-registration-modal-schema="Prereg Challenge"] input');
            await click('[data-test-new-registration-modal-create-draft-button]');
            assert.dom('[data-test-prereg-challenge-modal-body]').isVisible();
            assert.dom('[data-test-prereg-challenge-modal-continue-button]').isDisabled();
            await untrackedClick('[data-test-prereg-challenge-modal-consent-checkbox]');
            assert.dom('[data-test-prereg-challenge-modal-continue-button]').isNotDisabled();
            await click('[data-test-prereg-challenge-modal-cancel-button]');
            assert.dom('[data-test-prereg-challenge-modal-body]').isNotVisible();
        }
    });
});
