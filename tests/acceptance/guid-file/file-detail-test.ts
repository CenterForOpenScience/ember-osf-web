import {
    click as untrackedClick,
    currentURL,
    fillIn,
    settled,
    triggerEvent,
    triggerKeyEvent,
    visit,
} from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import config from 'ember-get-config';
import { percySnapshot } from 'ember-percy';
import moment from 'moment';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

module('Acceptance | guid file', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    module('current user files', () => {
        test('works', async assert => {
            const currentUser = server.create('user', 'loggedIn');
            const fileOne = server.create('file', { user: currentUser });
            await visit(`--file/${fileOne.id}`);
            assert.equal(currentURL(), `--file/${fileOne.guid}`);
            await percySnapshot(assert);
        });

        test('filters files', async assert => {
            const currentUser = server.create('user', 'loggedIn');
            const fileOne = server.create(
                'file',
                {
                    name: 'aa.gif',
                    user: currentUser,
                },
            );
            server.create(
                'file',
                {
                    name: 'az.gif',
                    user: currentUser,
                },
            );
            server.create(
                'file',
                {
                    name: 'za.gif',
                    user: currentUser,
                },
            );
            server.create(
                'file',
                {
                    name: 'zz.gif',
                    user: currentUser,
                },
            );

            await visit(`--file/${fileOne.id}`);
            assert.dom('[data-test-file-item-link]').exists({ count: 4 }, 'initial setup');

            await click('[data-test-filter-button]');
            assert.dom('[data-test-close-filter-button]').exists('after clicking filter');
            assert.dom('[data-test-filter-input]').exists('after clicking filter');
            percySnapshot(assert);

            fillIn('[data-test-filter-input]', 'a');
            triggerKeyEvent('[data-test-filter-input]', 'keyup', 'Shift');
            await settled();
            assert.dom('[data-test-file-item-link]').exists({ count: 3 }, 'filter for a');

            fillIn('[data-test-filter-input]', 'z');
            triggerKeyEvent('[data-test-filter-input]', 'keyup', 'Shift');
            await settled();
            assert.dom('[data-test-file-item-link]').exists({ count: 3 }, 'filter for z');

            fillIn('[data-test-filter-input]', 'az');
            triggerKeyEvent('[data-test-filter-input]', 'keyup', 'Shift');
            await settled();
            assert.dom('[data-test-file-item-link]').exists({ count: 1 }, 'filter for az');

            fillIn('[data-test-filter-input]', 'aa');
            triggerKeyEvent('[data-test-filter-input]', 'keyup', 'Shift');
            await settled();
            assert.dom('[data-test-file-item-link]').exists({ count: 1 }, 'filter for aa');

            fillIn('[data-test-filter-input]', 'zz');
            triggerKeyEvent('[data-test-filter-input]', 'keyup', 'Shift');
            await settled();
            assert.dom('[data-test-file-item-link]').exists({ count: 1 }, 'filter for zz');

            assert.dom('[data-test-close-filter-button]').exists('after final filter');
            await click('[data-test-close-filter-button]');
            assert.dom('[data-test-file-item-link]').exists({ count: 4 }, 'no more filter');
        });

        test('switches between files', async assert => {
            const currentUser = server.create('user', 'loggedIn');
            const fileOne = server.create(
                'file',
                {
                    name: 'FooBar.txt',
                    user: currentUser,
                },
            );
            const fileTwo = server.create(
                'file',
                {
                    name: 'XyzzyPlugh.txt',
                    user: currentUser,
                },
            );
            await visit(`/--file/${fileOne.id}`);
            assert.equal(currentURL(), `/--file/${fileOne.guid}`);
            assert.dom('[data-test-file-title-header]').containsText(fileOne.name);
            assert.dom(`[data-test-file-item-link="${fileTwo.name}"]`).exists();
            await click(`[data-test-file-item-link="${fileTwo.name}"]`);
            assert.equal(currentURL(), `/--file/${fileTwo.guid}`);
            assert.dom('[data-test-file-title-header]').containsText(fileTwo.name);
        });

        test('deletes files', async assert => {
            const currentUser = server.create('user', 'loggedIn');
            const file = server.create('file', { user: currentUser });
            await visit(`--file/${file.id}`);
            assert.equal(currentURL(), `--file/${file.id}`);
            await click('[data-test-delete-button]');
            await percySnapshot(assert);
            assert.dom('[data-test-delete-file-cancel]').exists();
            await click('[data-test-delete-file-cancel]');
            assert.dom('[data-test-delete-file-cancel]').doesNotExist();
            await click('[data-test-delete-button]');
            assert.dom('[data-test-delete-file-confirm]').exists();
            await click('[data-test-delete-file-confirm]');
            assert.equal(currentURL(), `/--user/${currentUser.id}/quickfiles`);
        });

        test('shows current version number in title bar', async assert => {
            const currentUser = server.create('user', 'loggedIn');
            const file = server.create(
                'file',
                {
                    user: currentUser,
                    currentVersion: 42,
                    name: 'Xyzzy.gif',
                },
            );
            await visit(`--file/${file.id}`);
            assert.dom('[data-test-file-title-header]').hasText('Xyzzy.gif (Version: 42)');
        });

        test('share popover works', async assert => {
            const {
                OSF: {
                    renderUrl,
                    url: osfUrl,
                },
            } = config;
            const encodedOsfUrl = encodeURIComponent(osfUrl);

            const currentUser = server.create('user', 'loggedIn');
            const file = server.create(
                'file',
                {
                    user: currentUser,
                },
            );
            await visit(`--file/${file.id}`);

            await click('[data-test-share-button]');
            assert.dom('[data-test-copyable-link]').exists('initial state');
            assert.dom('[data-test-share-iframe]').isNotVisible('initial state');
            assert.dom('[data-test-copyable-link] input')
                .hasValue(
                    `${renderUrl}?url=${encodedOsfUrl}${file.guid}%2Fdownload`,
                    'intial state',
                );
            const twitter = 'https://twitter.com/intent/tweet?text=';
            assert.dom('[data-test-twitter-link]')
                .hasAttribute(
                    'href',
                    `${twitter}${file.name}&url=${encodedOsfUrl}${file.guid}&via=${config.social.twitter.viaHandle}`,
                );
            assert.dom('[data-test-facebook-link]')
                .hasAttribute(
                    'href',
                    `https://www.facebook.com/sharer/sharer.php?u=${encodedOsfUrl}${file.guid}`,
                );
            assert.dom('[data-test-linkedin-link]')
                .hasAttribute(
                    'href',
                    `https://www.linkedin.com/cws/share?title=${file.name}&url=${encodedOsfUrl}${file.guid}`,
                );
            assert.dom('[data-test-email-link]')
                .hasAttribute(
                    'href',
                    `mailto:?body=${encodedOsfUrl}${file.guid}&subejct=${file.name}`,
                );

            // For some reason I can't click on the tab links without the window disappearing,
            // so I can't test the visibility of these panes.
            assert.dom('[data-test-share-js]')
                .hasValue(/<style>/);
            assert.dom('[data-test-share-js]')
                .hasValue(/<script>/);
            assert.dom('[data-test-share-js]')
                .hasValue(/function renderMfr\(\)/);
            assert.dom('[data-test-share-iframe]')
                .hasValue(/<iframe src=/);
        });
    });

    module('other user files', () => {
        test('works', async assert => {
            server.create('user', 'loggedIn');
            const otherUser = server.create('user');
            const file = server.create('file', { user: otherUser });
            await visit(`--file/${file.id}`);
            await percySnapshot(assert);
        });

        test('filters files', async assert => {
            server.create('user', 'loggedIn');
            const otherUser = server.create('user');
            const fileOne = server.create(
                'file',
                {
                    name: 'aa.gif',
                    user: otherUser,
                },
            );
            server.create(
                'file',
                {
                    name: 'az.gif',
                    user: otherUser,
                },
            );
            server.create(
                'file',
                {
                    name: 'za.gif',
                    user: otherUser,
                },
            );
            server.create(
                'file',
                {
                    name: 'zz.gif',
                    user: otherUser,
                },
            );

            await visit(`--file/${fileOne.id}`);
            assert.dom('[data-test-file-item-link]').exists({ count: 4 }, 'initial setup');

            await click('[data-test-filter-button]');
            assert.dom('[data-test-close-filter-button]').exists('after clicking filter');
            assert.dom('[data-test-filter-input]').exists('after clicking filter');
            percySnapshot(assert);

            fillIn('[data-test-filter-input]', 'a');
            triggerKeyEvent('[data-test-filter-input]', 'keyup', 'Shift');
            await settled();
            assert.dom('[data-test-file-item-link]').exists({ count: 3 }, 'filter for a');

            fillIn('[data-test-filter-input]', 'z');
            triggerKeyEvent('[data-test-filter-input]', 'keyup', 'Shift');
            await settled();
            assert.dom('[data-test-file-item-link]').exists({ count: 3 }, 'filter for z');

            fillIn('[data-test-filter-input]', 'az');
            triggerKeyEvent('[data-test-filter-input]', 'keyup', 'Shift');
            await settled();
            assert.dom('[data-test-file-item-link]').exists({ count: 1 }, 'filter for az');

            fillIn('[data-test-filter-input]', 'aa');
            triggerKeyEvent('[data-test-filter-input]', 'keyup', 'Shift');
            await settled();
            assert.dom('[data-test-file-item-link]').exists({ count: 1 }, 'filter for aa');

            fillIn('[data-test-filter-input]', 'zz');
            triggerKeyEvent('[data-test-filter-input]', 'keyup', 'Shift');
            await settled();
            assert.dom('[data-test-file-item-link]').exists({ count: 1 }, 'filter for zz');

            assert.dom('[data-test-close-filter-button]').exists('after final filter');
            await click('[data-test-close-filter-button]');
            assert.dom('[data-test-file-item-link]').exists({ count: 4 }, 'no more filter');
        });

        test('switches between files', async assert => {
            server.create('user', 'loggedIn');
            const otherUser = server.create('user');
            const fileOne = server.create(
                'file',
                {
                    name: 'FooBar.txt',
                    user: otherUser,
                },
            );
            const fileTwo = server.create(
                'file',
                {
                    name: 'XyzzyPlugh.txt',
                    user: otherUser,
                },
            );
            await visit(`/--file/${fileOne.id}`);
            assert.equal(currentURL(), `/--file/${fileOne.guid}`);
            assert.dom('[data-test-file-title-header]').containsText(fileOne.name);
            assert.dom(`[data-test-file-item-link="${fileTwo.name}"]`).exists();
            await click(`[data-test-file-item-link="${fileTwo.name}"]`);
            assert.equal(currentURL(), `/--file/${fileTwo.guid}`);
            assert.dom('[data-test-file-title-header]').containsText(fileTwo.name);
        });

        test('does not allow delete', async assert => {
            server.create('user', 'loggedIn');
            const otherUser = server.create('user');
            const file = server.create('file', { user: otherUser });
            await visit(`--file/${file.id}`);
            assert.dom('[data-test-delete-button]').doesNotExist();
        });

        test('shows current version number in title bar', async assert => {
            server.create('user', 'loggedIn');
            const otherUser = server.create('user');
            const file = server.create(
                'file',
                {
                    user: otherUser,
                    currentVersion: 42,
                    name: 'Xyzzy.gif',
                },
            );
            await visit(`--file/${file.id}`);
            assert.dom('[data-test-file-title-header]').hasText('Xyzzy.gif (Version: 42)');
        });

        test('shows a list of versions', async assert => {
            const currentUser = server.create('user', 'loggedIn');
            const date = moment('2019-01-03T17:37:18.319Z').format('YYYY-MM-DD h:mm A');
            const file = server.create(
                'file',
                {
                    user: currentUser,
                },
            );
            await visit(`--file/${file.guid}`);

            await click('[data-test-revisions-tab]');
            await percySnapshot(assert);
            assert.dom('[data-test-version-cell="1"]').hasText('1', 'initial state');
            assert.dom('[data-test-select-version="1"]').exists('initial state');
            assert.dom('[data-test-modified-date-cell="2"]')
                .hasText(date, 'initial state');
            assert.dom('[data-test-download-count-cell="2"]')
                .hasText('3', 'initial state');
            assert.dom('[data-test-download-version-cell="2"] button')
                .exists('initial state');
            assert.dom('[data-test-md5-hash-cell="2"] input')
                .hasValue('b43e7833065b0d49ef44d91593cda502', 'initial state');
            assert.dom('[data-test-sha2-hash-cell="2"] input')
                .hasValue(
                    'ed86f96e24194cf38a82af6df56da7af6be2d29ddfd99411d6fe9ae993c4d368',
                    'initial state',
                );

            await click('[data-test-select-version="1"]');
            assert.equal(currentURL(), `/--file/${file.guid}?show=revision`);
            assert.dom('[data-test-select-version="1"]')
                .doesNotExist('viewing version 1');
            assert.dom('[data-test-version-cell="1"]')
                .hasText('1', 'viewing version 1');
            assert.dom('[data-test-file-title-header]')
                .hasText(`${file.name} (Version: 1)`, 'viewing version 1');
            assert.dom('[data-test-select-version="2"]')
                .exists('viewing version 1');
        });
    });

    module('tags', () => {
        test('shows all tags', async assert => {
            const currentUser = server.create('user', 'loggedIn');
            const file = server.create(
                'file',
                {
                    user: currentUser,
                    currentVersion: 42,
                    name: 'Xyzzy.gif',
                    tags: ['foo', 'bar', 'baz', 'xyzzy', 'plugh'],
                },
            );
            await visit(`--file/${file.id}`);
            assert.dom('[data-test-tags-panel]')
                .exists();
            assert.dom('[data-test-tags-widget-tag="foo"]')
                .exists();
            assert.dom('[data-test-tags-widget-tag="bar"]')
                .exists();
            assert.dom('[data-test-tags-widget-tag="baz"]')
                .exists();
            assert.dom('[data-test-tags-widget-tag="xyzzy"]')
                .exists();
            assert.dom('[data-test-tags-widget-tag="plugh"]')
                .exists();
        });

        test('deletes tags', async assert => {
            const currentUser = server.create('user', 'loggedIn');
            const file = server.create(
                'file',
                {
                    user: currentUser,
                    currentVersion: 42,
                    name: 'Xyzzy.gif',
                    tags: ['foo', 'bar', 'baz', 'xyzzy', 'plugh'],
                },
            );
            await visit(`--file/${file.id}`);
            await untrackedClick(
                '[data-test-tags-widget-tag="foo"] + a[class*="emberTagInput-remove"]',
            );
            assert.dom('[data-test-tags-widget-tag="foo"]')
                .doesNotExist();
            assert.dom('[data-test-tags-widget-tag="bar"]')
                .exists();
            assert.dom('[data-test-tags-widget-tag="baz"]')
                .exists();
            assert.dom('[data-test-tags-widget-tag="xyzzy"]')
                .exists();
            assert.dom('[data-test-tags-widget-tag="plugh"]')
                .exists();
        });

        test('adds tags', async assert => {
            const currentUser = server.create('user', 'loggedIn');
            const file = server.create(
                'file',
                {
                    user: currentUser,
                    currentVersion: 42,
                    name: 'Xyzzy.gif',
                    tags: ['foo', 'bar', 'baz', 'xyzzy'],
                },
            );
            await visit(`--file/${file.id}`);
            assert.dom('[data-test-tags-panel]')
                .exists();
            assert.dom('[data-test-tags-widget-tag="foo"]')
                .exists();
            assert.dom('[data-test-tags-widget-tag="bar"]')
                .exists();
            assert.dom('[data-test-tags-widget-tag="baz"]')
                .exists();
            assert.dom('[data-test-tags-widget-tag="xyzzy"]')
                .exists();
            assert.dom('[data-test-tags-widget-tag="plugh"]')
                .doesNotExist();

            await fillIn('input[class*="emberTagInput-input"]', 'plugh');
            await triggerEvent('input[class*="emberTagInput-input"]', 'blur');
            assert.dom('[data-test-tags-widget-tag="plugh"]')
                .exists();
        });

        test('does not show widget when another user\'s file with no tags', async assert => {
            server.create('user', 'loggedIn');
            const otherUser = server.create('user');
            const file = server.create(
                'file',
                {
                    user: otherUser,
                    currentVersion: 42,
                    name: 'Xyzzy.gif',
                    tags: [],
                },
            );
            await visit(`--file/${file.id}`);
            assert.dom('[data-test-tags-panel]')
                .doesNotExist();
        });
    });
});
