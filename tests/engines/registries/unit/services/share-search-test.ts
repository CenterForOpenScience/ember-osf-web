import { setupEngineTest } from 'ember-osf-web/tests/helpers/engines';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';
import ShareSearch from 'registries/services/share-search';

function getSearchResponse(identifiers?: string[]) {
    return {
        hits: {
            hits: [{
                _index: 'share_customtax_1',
                _type: 'creativeworks',
                _id: '46218-570-0DA',
                _score: null,
                _source: {
                    id: '46218-570-0DA',
                    type: 'registration',
                    title: 'Pod Assignment &amp;',
                    description: '&lt;&gt;&lt;',
                    language: null,
                    date_created: '2018-10-04T18:37:42.820512+00:00',
                    date_modified: '2018-10-04T18:37:42.82049+00:00',
                    date_updated: null,
                    date_published: '2018-10-04T16:22:11.995933+00:00',
                    registration_type: 'AsPredicted Preregistration',
                    withdrawn: false,
                    justification: null,
                    tags: ['&amp;', 'Foo'],
                    identifiers: identifiers || ['http://osf.io/w4yhb/'],
                    sources: ['OSF'],
                    subjects: [],
                    subject_synonyms: [],
                    lists: {
                        contributors: [{
                            id: '6402D-242-421',
                            type: 'person',
                            name: 'Graham &gt; Berlin',
                            given_name: 'Graham',
                            family_name: 'Berlin',
                            identifiers: ['http://osf.io/6j8ub/'],
                            order_cited: 0,
                            cited_as: 'Graham Berlin',
                            affiliations: [],
                            awards: [],
                            relation: 'creator',
                        }, {
                            id: '6415A-84F-065',
                            type: 'person',
                            name: 'Nicole &lt; Grant',
                            given_name: 'Nicole',
                            family_name: 'Grant',
                            identifiers: ['http://osf.io/8zrkb/'],
                            order_cited: 4,
                            cited_as: 'Nicole Grant',
                            affiliations: [],
                            relation: 'creator',
                        }],
                    },
                },
            }],
        },
    };
}

module('Registries | Unit | Service | share-search', hooks => {
    setupEngineTest(hooks, 'registries');

    // Replace this with your real tests.
    test('it exists', function(assert) {
        const service = this.owner.lookup('service:share-search');
        assert.ok(service);
    });

    test('_postProcessRegistrations', function(this: TestContext, assert) {
        const service = this.owner.lookup('service:share-search') as ShareSearch;

        const registrations = service._postProcessRegistrations(getSearchResponse());

        assert.equal(registrations.length, 1);
        assert.equal(registrations[0].title, 'Pod Assignment &');
        assert.equal(registrations[0].description, '<><');
        assert.equal(registrations[0].tags[0], '&');
        assert.equal(registrations[0].contributors[0].name, 'Graham > Berlin');
        assert.equal(registrations[0].contributors[1].name, 'Nicole < Grant');
    });

    test('recognizes all OSF source envs', function(this: TestContext, assert) {
        const service = this.owner.lookup('service:share-search') as ShareSearch;
        [ // Source envs
            'https://osf.io/w4yhb/',
            'https://test.osf.io/w4yhb/',
            'https://staging.osf.io/w4yhb/',
            'https://staging2.osf.io/w4yhb/',
            'https://staging3.osf.io/w4yhb/',
        ].forEach(identifier => {
            [
                {
                    identifiers: [identifier, 'https://staging-share.osf.io/w4yhb/'],
                    expected: identifier,
                },
                {
                    identifiers: ['https://staging-share.osf.io/w4yhb/', identifier],
                    expected: identifier,
                },
                {
                    identifiers: [identifier],
                    expected: identifier,
                },
            ].forEach(({ identifiers, expected }) => {
                const [registration] = service._postProcessRegistrations(getSearchResponse(identifiers));
                assert.equal(registration.mainLink, expected);
            });
        });
    });
});
