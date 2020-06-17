import { settled, triggerEvent } from '@ember/test-helpers';
import { ModelInstance } from 'ember-cli-mirage';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { t } from 'ember-intl/test-support';
import moment from 'moment';
import { module, test } from 'qunit';

import { MirageCollection } from 'ember-osf-web/mirage/factories/collection';
import { Permission } from 'ember-osf-web/models/osf-model';
import { click, visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
import stripHtmlTags from 'ember-osf-web/utils/strip-html-tags';

const registrationStates: Record<string, {
    trait: string, icon: string,
    initiallyOpened: boolean, hasAdminActions: boolean }> = {
        embargoed: {
            trait: 'isEmbargoed',
            icon: 'lock',
            initiallyOpened: false,
            hasAdminActions: true,
        },
        pendingWithdrawal: {
            trait: 'isPendingWithdrawal',
            icon: 'clock-o',
            initiallyOpened: true,
            hasAdminActions: false,
        },
        pendingRegistration: {
            trait: 'isPendingApproval',
            icon: 'clock-o',
            initiallyOpened: true,
            hasAdminActions: false,
        },
        pendingEmbargo: {
            trait: 'isPendingEmbargoApproval',
            icon: 'clock-o',
            initiallyOpened: true,
            hasAdminActions: false,
        },
        pendingEmbargoTermination: {
            trait: 'isPendingEmbargoTerminationApproval',
            icon: 'clock-o',
            initiallyOpened: true,
            hasAdminActions: false,
        },
        public: {
            trait: 'isPublic',
            icon: 'eye',
            initiallyOpened: false,
            hasAdminActions: true,
        },
    };

module('Registries | Acceptance | overview.topbar', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    test('topbar is not visible for archiving or withdrawn registrations', async assert => {
        const reg = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            provider: server.create('registration-provider', { id: 'osf' }),
        });
        await visit(`/${reg.id}/`);
        await settled();

        assert.dom('[data-test-topbar-share-bookmark-fork]').isVisible();
        assert.dom('[data-test-topbar-states]').isVisible();

        const withdrawnReg = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
        }, 'isWithdrawn');

        await visit(`/${withdrawnReg.id}/`);
        await settled();

        assert.dom('[data-test-topbar-share-bookmark-fork]').doesNotExist();
        assert.dom('[data-test-topbar-states]').doesNotExist();

        const archivingReg = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
        }, 'isWithdrawn');

        await visit(`/${archivingReg.id}/`);
        await settled();

        assert.dom('[data-test-topbar-share-bookmark-fork]').doesNotExist();
        assert.dom('[data-test-topbar-states]').doesNotExist();
    });

    test('bookmarks work', async assert => {
        const reg = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            provider: server.create('registration-provider', { id: 'osf' }),
        });

        const bookmarksColl = server.create(
            'collection',
            { title: 'Bookmarks', bookmarks: true },
        ) as ModelInstance<MirageCollection>;

        await visit(`/${reg.id}/`);
        await settled();

        assert.dom('[data-test-bookmarks-button]').isVisible();
        assert.dom('[data-test-bookmarks-button] i').hasClass('fa-bookmark-o');

        // Bookmark registration
        await triggerEvent('[data-test-bookmarks-button]', 'mouseenter');
        assert.dom('.ember-bootstrap-tooltip .tooltip-inner').hasText(
            t('registries.overview.tooltips.bookmark').toString(),
        );

        await click('[data-test-bookmarks-button]');
        await settled();
        assert.dom('[data-test-bookmarks-button] i').hasClass('fa-bookmark');

        bookmarksColl.reload();
        assert.ok(bookmarksColl.linkedRegistrationIds.includes(reg.id));

        // Remove from bookmarks
        await triggerEvent('[data-test-bookmarks-button]', 'mouseenter');
        assert.dom('.ember-bootstrap-tooltip .tooltip-inner').hasText(
            t('registries.overview.tooltips.remove_bookmark').toString(),
        );

        await click('[data-test-bookmarks-button]');
        await settled();
        assert.dom('[data-test-bookmarks-button] i').hasClass('fa-bookmark-o');

        bookmarksColl.reload();
        assert.notOk(bookmarksColl.linkedRegistrationIds.includes(reg.id));
    });

    test('sharing dropdown works', async assert => {
        const reg = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
        });

        await visit(`/${reg.id}/`);

        assert.dom('[data-test-social-sharing-button]').isVisible();

        await triggerEvent('[data-test-social-sharing-button]', 'mouseenter');
        assert.dom('.ember-bootstrap-tooltip .tooltip-inner').hasText(
            t('registries.overview.tooltips.share').toString(),
        );

        assert.dom('[data-test-sharing-options]').isNotVisible();
        await click('[data-test-social-sharing-button]');
        await settled();
        assert.dom('[data-test-sharing-options]').isVisible();

        ['Email', 'Linkedin', 'Twitter', 'Facebook'].forEach(
            medium => assert.dom(`[data-test-share-registration="${medium}"]`).isVisible(),
        );
    });

    test('forks dropdown works', async assert => {
        const reg = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
        });

        await visit(`/${reg.id}/`);
        await settled();

        assert.dom('[data-test-forks-dropdown-button]').isVisible();

        await triggerEvent('[data-test-forks-dropdown-button]', 'mouseenter');
        assert.dom('.ember-bootstrap-tooltip .tooltip-inner').hasText(
            t('registries.overview.tooltips.fork').toString(),
        );

        assert.dom('[data-test-forks-dropdown-options]').isNotVisible();
        await click('[data-test-forks-dropdown-button]');
        assert.dom('[data-test-forks-dropdown-options]').isVisible();

        assert.dom('[data-test-go-to-forks-view]').isVisible();
        assert.notOk(Boolean(reg.forkIds.length));

        await click('[data-test-fork-registration]');
        await settled();

        reg.reload();
        assert.ok(Boolean(reg.forkIds.length));
    });

    test('state description has correct text', async assert => {
        for (const [state, stateInfo] of Object.entries(registrationStates)) {
            const reg = server.create('registration', {
                registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
                currentUserPermissions: Object.values(Permission),
            }, stateInfo.trait);

            await visit(`/${reg.id}/`);
            await settled();

            assert.dom('[data-test-state-button]').hasText(t(`registries.overview.${state}.text`).toString());

            if (!stateInfo.initiallyOpened) {
                await click('[data-test-state-button]');
                await settled();
            }

            if (stateInfo.hasAdminActions) {
                assert.dom('[data-test-state-admin-actions]').isVisible();
            }

            assert.dom('[data-test-state-description-short]').hasText(
                t(`registries.overview.${state}.short_description`).toString(),
            );

            if (reg.embargoEndDate) {
                assert.dom('[data-test-state-description-long]').hasText(
                    stripHtmlTags(
                        t(`registries.overview.${state}.long_description`, {
                            embargoEndDate: moment(reg.embargoEndDate).format('MMMM D, YYYY'),
                            htmlSafe: true,
                        }).toString(),
                    ),
                );
            }
            assert.dom('[data-test-state-icon]').hasClass(`fa-${stateInfo.icon}`);
        }
    });
});
