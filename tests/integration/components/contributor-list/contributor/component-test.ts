import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import faker from 'faker';
import { module, test } from 'qunit';

import hbs from 'htmlbars-inline-precompile';

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
});
