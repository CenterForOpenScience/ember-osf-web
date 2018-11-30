import { click, currentRouteName } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { percySnapshot } from 'ember-percy';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

import {
    draftRegisterNode,
    draftRegisterNodeMultiple,
    registerNode,
    registerNodeMultiple,
} from 'ember-osf-web/mirage/helpers';
import { currentURL, visit } from 'ember-osf-web/tests/helpers';

import Node from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';
import User from 'ember-osf-web/models/user';

module('Acceptance | guid-node/registrations', hooks => {
    setupApplicationTest(hooks);
    setupMirage(hooks);

    test('logged out, no registrations', async assert => {
        server.create('root', { currentUser: null });
        const node = server.create<Node>('node', { id: 'decaf', currentUserPermissions: [] });

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
        server.create('root', { currentUser: null });
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
        const contributorUser = server.create('user');

        server.create('root', { currentUser: contributorUser });

        const node = server.create<Node>('node', { id: 'decaf', currentUserPermissions: [Permission.Admin] });

        const url = `/${node.id}/registrations`;

        await visit(url);

        assert.equal(currentURL(), url, `We are on ${url}`);

        assert.dom('[data-test-new-registration-button]').exists({ count: 1 });

        assert.dom('[data-test-registrations-pane]').includesText(
            'There have been no completed registrations of this project.',
        );

        assert.dom('[data-test-new-registration-button]').exists();

        await click('[data-test-registrations-container] a[href="#drafts"]');

        assert.dom('[data-test-registrations-pane]').isNotVisible();
        assert.dom('[data-test-draft-registrations-pane]').isVisible();

        assert.dom('[data-test-draft-registrations-pane]').includesText(
            'There are no draft registrations of this project.',
        );
    });

    test('logged in admin, 1 registration', async assert => {
        const contributorUser = server.create('user');

        server.create('root', { currentUser: contributorUser });

        const node = server.create<Node>('node', {
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
        // @ts-ignore until we kill async relationships
        registerNode(server, node, { registrationSchema, registeredMeta });

        const url = `/${node.id}/registrations`;

        await visit(url);

        assert.equal(currentURL(), url, `We are on ${url}`);

        assert.dom('[data-test-new-registration-button]').exists({ count: 1 });

        assert.dom('[data-test-node-card]').exists({ count: 1 });

        assert.dom('[data-test-node-card-heading]').includesText(node.title);

        assert.dom('[data-test-node-card-body]').includesText(registrationSchemaName);

        assert.dom('[data-test-node-card-body]').includesText(registrationTitle);

        await click('[data-test-registrations-container] a[href="#drafts"]');

        assert.dom('[data-test-registrations-pane]').isNotVisible();
        assert.dom('[data-test-draft-registrations-pane]').isVisible();

        assert.dom('[data-test-draft-registrations-pane]').includesText(
            'There are no draft registrations of this project.',
        );
    });

    test('logged in admin, 12 registrations', async assert => {
        const contributorUser = server.create('user');

        server.create('root', { currentUser: contributorUser });

        const node = server.create<Node>('node', {
            id: 'decaf',
            title: 'Test Title',
            currentUserPermissions: [Permission.Admin],
        });

        server.create('contributor', { node, users: contributorUser });

        server.loadFixtures('registration-schemas');
        const registrationSchema = server.schema.registrationSchemas.all().models[0];
        // @ts-ignore until we kill async relationships
        registerNodeMultiple(server, node, 12, { registrationSchema });

        const url = `/${node.id}/registrations`;

        await visit(url);

        assert.equal(currentURL(), url, `We are on ${url}`);

        assert.dom('[data-test-new-registration-button]').exists({ count: 1 });

        assert.dom('[data-test-node-card]').exists({ count: 10 });

        assert.dom('[data-test-node-card]').includesText(node.title);
        await percySnapshot(assert);

        await click('[data-test-next-page-button]');

        assert.dom('[data-test-node-card]').exists({ count: 2 });

        assert.dom('[data-test-node-card]').includesText(node.title);

        await click('[data-test-registrations-container] a[href="#drafts"]');

        assert.dom('[data-test-registrations-pane]').isNotVisible();
        assert.dom('[data-test-draft-registrations-pane]').isVisible();

        assert.dom('[data-test-draft-registrations-pane]').includesText(
            'There are no draft registrations of this project.',
        );
    });

    test('logged in admin, 1 draft registration', async assert => {
        const initiator = server.create<User>('user');

        server.create('root', { currentUser: initiator });

        const node = server.create<Node>('node', {
            id: 'decaf',
            currentUserPermissions: [Permission.Admin],
        });

        server.loadFixtures('registration-schemas');

        const registrationSchema = server.schema.registrationSchemas.all().models.filter(schema =>
            schema.name === 'Prereg Challenge')[0];

        const registrationMetadata = {
            q1: { comments: [], value: 'Registration Title', extra: [] },
        };

        // @ts-ignore until we kill async relationships
        draftRegisterNode(server, node, { initiator, registrationSchema, registrationMetadata });

        const url = `/${node.id}/registrations`;

        await visit(url);

        assert.equal(currentURL(), url, `We are on ${url}`);

        assert.dom('[data-test-new-registration-button]').exists({ count: 1 });

        await click('[data-test-registrations-container] a[href="#drafts"]');

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
        const initiator = server.create<User>('user');

        server.create('root', { currentUser: initiator });

        const node = server.create<Node>('node', {
            id: 'decaf',
            currentUserPermissions: [Permission.Admin],
        });

        server.loadFixtures('registration-schemas');

        // @ts-ignore until we kill async relationships
        draftRegisterNodeMultiple(server, node, 12, { initiator });

        const url = `/${node.id}/registrations`;

        await visit(url);

        assert.equal(currentURL(), url, `We are on ${url}`);

        assert.dom('[data-test-new-registration-button]').exists({ count: 1 });

        await click('[data-test-registrations-container] a[href="#drafts"]');

        assert.dom('[data-test-draft-registrations-pane]').isVisible();

        assert.dom('[data-test-draft-registrations-pane]').doesNotIncludeText(
            'There are no draft registrations of this project.',
        );

        assert.dom('[data-test-draft-registration-card]').exists({ count: 10 });

        await click('[data-test-next-page-button]');

        assert.dom('[data-test-draft-registration-card]').exists({ count: 2 });
        await percySnapshot(assert);
    });

    test('logged in admin, new registration', async assert => {
        const contributorUser = server.create('user');

        server.create('root', { currentUser: contributorUser });

        const node = server.create<Node>('node', { id: 'decaf', currentUserPermissions: [Permission.Admin] });

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
        const contributorUser = server.create('user');

        server.create('root', { currentUser: contributorUser });

        const node = server.create<Node>('node', { id: 'decaf', currentUserPermissions: [Permission.Admin] });

        server.loadFixtures('registration-schemas');

        const url = `/${node.id}/registrations`;

        await visit(url);

        assert.equal(currentURL(), url, `We are on ${url}`);

        // Test prereg challenge modal twice to make sure state is reset
        for (let i = 0; i < 2; i++) {
            await click('[data-test-new-registration-button]');
            await click('[data-test-new-registration-modal-schema="Prereg Challenge"] input');
            await click('[data-test-new-registration-modal-create-draft-button]');
            assert.dom('[data-test-prereg-challenge-modal-body]').isVisible();
            assert.dom('[data-test-prereg-challenge-modal-continue-button]').isDisabled();
            await percySnapshot(assert);
            await click('[data-test-prereg-challenge-modal-consent-checkbox]');
            assert.dom('[data-test-prereg-challenge-modal-continue-button]').isNotDisabled();
            await click('[data-test-prereg-challenge-modal-cancel-button]');
            assert.dom('[data-test-prereg-challenge-modal-body]').isNotVisible();
        }
    });
});
