import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl, t, TestContext } from 'ember-intl/test-support';
import { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import { setupRenderingTest } from 'ember-qunit';
import moment from 'moment';
import { module, test } from 'qunit';

import { OsfLinkRouterStub } from '../../helpers/osf-link-router-stub';

module('Integration | Component | node-card', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
        this.intl = this.owner.lookup('service:intl');
    });

    test('it renders', async function(this: TestContext, assert) {
        this.owner.unregister('service:router');
        this.owner.register('service:router', OsfLinkRouterStub);
        const registration = server.create('registration', {
            tags: ['a', 'b', 'c'],
            description: 'Through the night',
            revisionState: RevisionReviewStates.Approved,
        }, 'currentUserAdmin');
        server.create('contributor', { node: registration, index: 0, bibliographic: true });
        server.create('contributor', { node: registration, index: 1, bibliographic: true });
        server.create('contributor', { node: registration, index: 2, bibliographic: true });
        const registrationModel = await this.store.findRecord(
            'registration', registration.id, { include: ['bibliographic_contributors'] },
        );
        this.set('node', registrationModel);

        await render(hbs`
            <NodeCard
                @node={{this.node}}
                @showTags={{true}}
                @delete={{this.delete}}
            />
        `);
        assert.dom('[data-test-node-title]').exists('Node title exists');
        assert.dom('[data-test-node-title]').hasText(registrationModel.title, 'Node title is corrent');
        assert.dom('[data-test-registration-template-label]').exists('Schema label exists');
        assert.dom('[data-test-registration-template-label]').hasText(
            this.intl.t('node_card.registration_template'), 'Schema label is correct',
        );
        assert.dom('[data-test-registration-template-name]').exists('Schema name exists');
        assert.dom('[data-test-registration-template-name]').hasTextContaining(
            registration.registrationSchema.name,
            'Schema name is correct',
        );
        assert.dom('[data-test-registration-registry-label]').exists('Registry label exists');
        assert.dom('[data-test-registration-registry-label]').hasText(
            this.intl.t('node_card.registry'),
            'Registry label is correct',
        );
        assert.dom('[data-test-registration-registry-name]').exists('Registry name exists');
        assert.dom('[data-test-registration-registry-name]').hasText(
            registration.provider.name,
        );
        assert.dom('[data-test-created-timestamp-label]').exists('Created timestamp label exists');
        assert.dom('[data-test-created-timestamp-label]').hasText(
            this.intl.t('node_card.registration.timestamp_label'),
            'Created timestamp label is correct',
        );
        assert.dom('[data-test-created-timestamp-value]').exists('Created timestamp value exists');
        assert.dom('[data-test-created-timestamp-value]').hasText(
            `${moment(registration.dateRegistered)}`,
            'Created timestamp value is correct',
        );
        assert.dom('[data-test-updated-timestamp-value]').exists('Updated timestamp value exists');
        assert.dom('[data-test-updated-timestamp-value]').hasText(
            `${moment(registration.dateModified)}`,
            'Updated timestamp value is correct',
        );
        assert.dom('[data-test-contributors-label]').exists('Contributors label exists');
        assert.dom('[data-test-contributors-label]').hasText(
            this.intl.t('node_card.contributors'),
            'Contributors label is correct',
        );
        for (const contributor of registration.contributors.models) {
            assert.dom(`[data-test-contributor-name='${contributor.users.id}']`).exists('Contributor name exists');
            assert.dom(`[data-test-contributor-name='${contributor.users.id}']`).hasTextContaining(
                contributor.users.familyName,
                'Contributor name is correct',
            );
        }
        assert.dom('[data-test-description-label]').exists('Description label exists');
        assert.dom('[data-test-description-label]').hasText(
            this.intl.t('node_card.description'),
            'Description label is correct',
        );
        assert.dom('[data-test-description]').hasTextContaining(
            registration.description, 'Description is correct',
        );
        assert.dom('[data-test-tags-label]').exists('Tags label exists');
        assert.dom('[data-test-tags-label]').hasText(
            this.intl.t('node_card.tags'),
            'Tags label is correct',
        );
        for (const tag of registration.tags) {
            assert.dom(`[data-test-tags-widget-tag='${tag}']`).exists('Tag exists');
            assert.dom(`[data-test-tags-widget-tag='${tag}']`).hasText(tag, 'Tag is correct');
        }
        assert.dom(`[data-test-view-button='${registration.id}']`).exists('View button exists');

        assert.dom('[data-test-update-button]').exists('Update button exists.');
        assert.dom('[data-test-update-button]').hasText(t('node_card.update_button').toString());
        assert.dom('[data-test-badge-list]').exists('Badge list exists');
    });

    test('it renders pending registration', async function(this: TestContext, assert) {
        this.owner.unregister('service:router');
        this.owner.register('service:router', OsfLinkRouterStub);
        const registration = server.create('registration', {
            reviewsState: RegistrationReviewStates.Pending,
        }, 'currentUserAdmin');
        const registrationModel = await this.store.findRecord('registration', registration.id);
        this.set('node', registrationModel);

        await render(hbs`
            <NodeCard
                @node={{this.node}}
                @showTags={{true}}
                @delete={{this.delete}}
            />
        `);
        assert.dom('[data-test-node-title]').exists('Node title exists');
        assert.dom('[data-test-description-label]').exists('Description label exists');
        assert.dom('[data-test-view-button]').exists('View button exists');
        assert.dom('[data-test-update-button]').doesNotExist('Update button does not exist.');
        assert.dom('[data-test-view-changes-button]').doesNotExist('Continue update button does not exist.');
        assert.dom('[data-test-badge-list]').doesNotExist('Badge list does not exist');
    });
});
