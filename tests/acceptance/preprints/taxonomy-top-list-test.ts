import { render } from '@ember/test-helpers';
import Ember from 'ember';
import { hbs } from 'ember-cli-htmlbars';
import { EnginesTestContext } from 'ember-engines/test-support';
import SubjectModel from 'ember-osf-web/models/subject';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Acceptance | preprints | taxonomy-top-list', hooks => {
    setupRenderingTest(hooks);

    test('it creates no rows when the list is undefined', async function(this: EnginesTestContext,assert) {
        // Given no list is provided
        // When the component is rendered
        await render(hbs`
            <Preprints::-components::TaxonomyTopList
                @provider='outdoorLife'
            >
            </Preprints::-components::TaxonomyTopList>
        `);

        // Then the subject container is verified
        assert.dom('[data-test-subject-container]').doesNotExist('no subjects are displayed');
    });

    test('it creates no rows when the list is empty', async function(this: EnginesTestContext,assert) {
        // Given the taxonomy list is created with two subjects
        this.set('list', [ ]);

        // When the component is rendered
        await render(hbs`
            <Preprints::-components::TaxonomyTopList
                @list={{this.list}}
                @provider='outdoorLife'
            >
            </Preprints::-components::TaxonomyTopList>
        `);

        // Then the subject container is verified
        assert.dom('[data-test-subject-container]').doesNotExist('no subjects are displayed');
    });

    test('it throws an error with a list and no provider', async function(this: EnginesTestContext,assert) {
        Ember.onerror = (error: Error) => {
            assert.equal(error.message,
                'A provider string must be provided with a valid list');
        };

        // Given the taxonomy list is created with two subjects
        this.set('list', [
            {
                text: 'elephant',
                taxonomyName: 'forgetful',
            } as SubjectModel,
        ]);

        // When the component is rendered
        await render(hbs`
            <Preprints::-components::TaxonomyTopList
                @list={{this.list}}
            >
            </Preprints::-components::TaxonomyTopList>
        `);
    });

    test('it creates a row of two subjects in desktop mode', async function(this: EnginesTestContext,assert) {
        // Given the taxonomy list is created with two subjects
        this.set('list', [
            {
                text: 'elephant',
                taxonomyName: 'forgetful',
            } as SubjectModel,
            {
                text: 'deer',
                taxonomyName: 'The sneaky',
            } as SubjectModel,
        ]);

        // When the component is rendered
        await render(hbs`
            <Preprints::-components::TaxonomyTopList
                @list={{this.list}}
                @provider='outdoorLife'
            >
            </Preprints::-components::TaxonomyTopList>
        `);

        // Then the subject container is verified
        const subjectContainers = this.element.querySelectorAll('[data-test-subject-container]');
        assert.equal(subjectContainers.length, 1, 'The subject container has 1 container');

        // And the link containers are verified
        const linkContainers = subjectContainers[0].querySelectorAll('[data-test-taxonomy-container]');
        assert.equal(linkContainers.length, 2, 'The link container is grouped in two');

        // And the first link is verified to be sorted correctly
        const links = linkContainers[0].querySelectorAll('[data-test-taxonomy-link]');
        assert.dom(links[0]).hasText('deer', 'The first link is deer');
        // And the href is corrected
        // eslint-disable-next-line max-len
        assert.dom(links[0]).hasAttribute('href', 'preprints/outdoorLife/discover?subject=The sneaky', 'The href is blank');
    });

    test('it creates two rows of two and one subject in desktop mode', async function(this: EnginesTestContext,assert) {
        // Given the taxonomy list is created with two subjects
        this.set('list', [
            {
                text: 'elephant',
                taxonomyName: 'forgetful',
            } as SubjectModel,
            {
                text: 'bamboon',
                taxonomyName: 'The great red bum',
            } as SubjectModel,
            {
                text: 'deer',
                taxonomyName: 'The sneaky',
            } as SubjectModel,
        ]);

        // When the component is rendered
        await render(hbs`
            <Preprints::-components::TaxonomyTopList
                @list={{this.list}}
                @provider='outdoorLife'
            >
            </Preprints::-components::TaxonomyTopList>
        `);


        // Then the subject container is verified
        const subjectContainers = this.element.querySelectorAll('[data-test-subject-container]');
        assert.equal(subjectContainers.length, 2, 'The subject container has 1 container');

        // And the link containers are verified
        let linkContainers = subjectContainers[0].querySelectorAll('[data-test-taxonomy-container]');
        assert.equal(linkContainers.length, 2, 'The link container is grouped in two');

        // And the first link is verified to be sorted correctly
        let links = linkContainers[1].querySelectorAll('[data-test-taxonomy-link]');
        assert.dom(links[0]).hasText('deer', 'The first link is deer');
        // And the href is corrected
        // eslint-disable-next-line max-len
        assert.dom(links[0]).hasAttribute('href', 'preprints/outdoorLife/discover?subject=The sneaky', 'The href is blank');

        linkContainers = subjectContainers[1].querySelectorAll('[data-test-taxonomy-container]');
        assert.equal(linkContainers.length, 1, 'The link container is grouped in one');

        // And the third link is verified to be sorted correctly
        links = linkContainers[0].querySelectorAll('[data-test-taxonomy-link]');
        assert.dom(links[0]).hasText('elephant', 'The first link is elephant');
        // And the href is corrected
        // eslint-disable-next-line max-len
        assert.dom(links[0]).hasAttribute('href', 'preprints/outdoorLife/discover?subject=forgetful', 'The href is blank');
    });
});
