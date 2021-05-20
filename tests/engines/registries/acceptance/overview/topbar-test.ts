import { triggerEvent } from '@ember/test-helpers';
import { ModelInstance } from 'ember-cli-mirage';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { t } from 'ember-intl/test-support';
import { percySnapshot } from 'ember-percy';
import moment from 'moment';
import { module, test } from 'qunit';

import { MirageCollection } from 'ember-osf-web/mirage/factories/collection';
import { Permission } from 'ember-osf-web/models/osf-model';
import { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import { click, visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';
import stripHtmlTags from 'ember-osf-web/utils/strip-html-tags';

const registrationStates: Record<string, {
    trait: string, icon: string,
    initiallyOpened: boolean, hasAdminActions: boolean }> = {
        embargo: {
            trait: 'isEmbargo',
            icon: 'lock',
            initiallyOpened: false,
            hasAdminActions: true,
        },
        pendingWithdraw: {
            trait: 'isPendingWithdraw',
            icon: 'clock',
            initiallyOpened: true,
            hasAdminActions: false,
        },
        pendingRegistrationApproval: {
            trait: 'isPendingRegistrationApproval',
            icon: 'clock',
            initiallyOpened: true,
            hasAdminActions: false,
        },
        pendingEmbargoApproval: {
            trait: 'isPendingEmbargoApproval',
            icon: 'clock',
            initiallyOpened: true,
            hasAdminActions: false,
        },
        pendingEmbargoTermination: {
            trait: 'isPendingEmbargoTermination',
            icon: 'clock',
            initiallyOpened: true,
            hasAdminActions: false,
        },
        pendingWithdrawRequest: {
            trait: 'isPendingWithdrawRequest',
            icon: 'clock',
            initiallyOpened: true,
            hasAdminActions: false,
        },
        accepted: {
            trait: 'isPublic',
            icon: 'eye',
            initiallyOpened: false,
            hasAdminActions: true,
        },
    };

module('Registries | Acceptance | overview.topbar', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    test('topbar is not visible for anonymous, archiving or withdrawn registrations', async assert => {
        const reg = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            provider: server.create('registration-provider'),
        });
        await visit(`/${reg.id}/`);

        assert.dom('[data-test-topbar-share-bookmark-fork]').isVisible();
        assert.dom('[data-test-topbar-states]').isVisible();

        const anonymousReg = server.create('registration', {
            isAnonymous: true,
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
        }, 'isWithdrawn');
        anonymousReg.attrs.apiMeta = { version: '', anonymous: true };

        await visit(`/${anonymousReg.id}/`);

        assert.dom('[data-test-topbar-share-bookmark-fork]').doesNotExist();
        assert.dom('[data-test-topbar-states]').doesNotExist();

        const withdrawnReg = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
        }, 'isWithdrawn');

        await visit(`/${withdrawnReg.id}/`);

        assert.dom('[data-test-topbar-share-bookmark-fork]').doesNotExist();
        assert.dom('[data-test-topbar-states]').doesNotExist();

        const archivingReg = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
        }, 'isWithdrawn');

        await visit(`/${archivingReg.id}/`);

        assert.dom('[data-test-topbar-share-bookmark-fork]').doesNotExist();
        assert.dom('[data-test-topbar-states]').doesNotExist();
    });

    test('bookmarks work', async assert => {
        const reg = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            provider: server.create('registration-provider'),
        });

        const bookmarksColl = server.create(
            'collection',
            { title: 'Bookmarks', bookmarks: true },
        ) as ModelInstance<MirageCollection>;

        await visit(`/${reg.id}/`);

        assert.dom('[data-test-bookmarks-button]').isVisible();
        assert.dom('[data-test-bookmarks-button] svg').hasClass('fa-bookmark');

        // Bookmark registration
        await triggerEvent('[data-test-bookmarks-button]', 'mouseenter');
        assert.dom('.ember-bootstrap-tooltip .tooltip-inner').hasText(
            t('registries.overview.tooltips.bookmark').toString(),
        );

        await click('[data-test-bookmarks-button]');
        assert.dom('[data-test-bookmarks-button] svg').hasClass('fa-bookmark');

        bookmarksColl.reload();
        assert.ok(bookmarksColl.linkedRegistrationIds.includes(reg.id));

        // Remove from bookmarks
        await triggerEvent('[data-test-bookmarks-button]', 'mouseenter');
        assert.dom('.ember-bootstrap-tooltip .tooltip-inner').hasText(
            t('registries.overview.tooltips.remove_bookmark').toString(),
        );

        await click('[data-test-bookmarks-button]');
        assert.dom('[data-test-bookmarks-button] svg').hasClass('fa-bookmark');

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

            assert.dom('[data-test-state-button]').hasText(t(`registries.overview.${state}.text`).toString());

            if (!stateInfo.initiallyOpened) {
                await click('[data-test-state-button]');
            }

            if (stateInfo.hasAdminActions) {
                assert.dom('[data-test-state-admin-actions]').isVisible();
            }
            assert.dom('[data-test-state-description-short]').exists();
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

    test('non-moderators cannot see moderator top-bar',
        async assert => {
            const reg = server.create('registration', {
                currentUserPermissions: Object.values(Permission),
                provider: server.create('registration-provider'),
            });

            await visit(`/${reg.id}?mode=moderator`);
            assert.dom('[data-test-moderation-dropdown-button]')
                .doesNotExist('non-moderators do not have access to moderator dropdown');
            assert.dom('[data-test-topbar-share-bookmark-fork]')
                .exists('moderator dropdown defaults to the bookmark and fork buttons for non-mods');
        });

    test('moderator does not see decision dropdown in standard view mode',
        async assert => {
            server.create('user', 'loggedIn');
            const reg = server.create('registration', {
                provider: server.create('registration-provider', 'currentUserIsModerator'),
            });
            await visit(`/${reg.id}`);
            assert.dom('[data-test-moderation-dropdown-button]')
                .doesNotExist('moderator action dropdown not shown in standard mode');
            assert.dom('[data-test-topbar-share-bookmark-fork]')
                .exists('moderators can see bookmark and fork buttons in standard mode');
        });

    test('moderators can see dropdown to make decision on public registration',
        async assert => {
            server.create('user', 'loggedIn');
            const reg = server.create('registration', {
                provider: server.create('registration-provider', 'currentUserIsModerator'),
                reviewsState: RegistrationReviewStates.Accepted,
            }, 'withReviewActions');
            await visit(`/${reg.id}?mode=moderator`);
            assert.dom('[data-test-moderation-dropdown-button]')
                .exists('moderator action dropdown exists');
            assert.dom('[data-test-topbar-share-bookmark-fork]')
                .doesNotExist('bookmark and fork buttons are hidden in moderator mode');

            await click('[data-test-moderation-dropdown-button]');
            await percySnapshot(assert);
            assert.dom('[data-test-registration-list-card-latest-action]')
                .exists('latest action is shown');
            assert.dom('[data-test-registration-card-toggle-actions]')
                .exists('dropdown for review actions exist');
            assert.dom('[data-test-moderation-dropdown-decision-checkbox]')
                .exists({ count: 1 }, 'only one option for moderator action for public registrations');
            assert.dom('[data-test-moderation-dropdown-decision-checkbox=force_withdraw]')
                .exists('checkbox to force withdraw shown for public registrations');
            assert.dom('[data-test-moderation-dropdown-comment]').exists('comment box shown');
            assert.dom('[data-test-moderation-dropdown-submit]')
                .isDisabled('submit button exists and is disabled before selection');
        });
});
