import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import faker from 'faker';

import { module, test } from 'qunit';

module('Integration | Component | contributor-list/contributor', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        const fakeUser = {
            givenName: faker.name.firstName(),
            familyName: faker.name.lastName(),
            fullName: faker.fake('{{name.firstName}} {{name.lastName}}'),
        };
        this.set('contrib', { users: fakeUser });

        await render(hbs`{{contributor-list/contributor contributor=this.contrib}}`);
        assert.dom(this.element).hasText(fakeUser.fullName);
        assert.dom('a').doesNotExist();

        await render(hbs`{{contributor-list/contributor contributor=this.contrib shouldShortenName=true}}`);
        assert.dom(this.element).hasText(fakeUser.familyName);
        assert.dom('a').doesNotExist();

        await render(hbs`{{contributor-list/contributor contributor=this.contrib shouldLinkUser=true}}`);
        assert.dom(this.element).hasText(fakeUser.fullName);
        assert.dom('a').exists({ count: 1 });
    });

    test('it renders deleted users', async function(assert) {
        const fakeUser = {
            relationshipLinks: {
                users: {
                    data: {
                        meta: {
                            fullName: 'Gone User',
                            familyName: 'User',
                            givenName: 'Gone',
                        },
                        status: 410,
                    },
                },
            },
            users: null,
        };
        this.set('contrib', fakeUser);

        await render(hbs`{{contributor-list/contributor contributor=this.contrib}}`);
        assert.dom(this.element).hasText('Gone User');
        assert.dom('a').doesNotExist();

        await render(hbs`{{contributor-list/contributor contributor=this.contrib shouldShortenName=true}}`);
        assert.dom(this.element).hasText('User');
        assert.dom('a').doesNotExist();

        await render(hbs`{{contributor-list/contributor contributor=this.contrib shouldLinkUser=true}}`);
        assert.dom(this.element).hasText('Gone User');
        assert.dom('a').doesNotExist('Deleted users should not be linked');
    });
});
