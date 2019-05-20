import EngineInstance from '@ember/engine/instance';
import { TestContext } from 'ember-test-helpers';
import sinon from 'sinon';

import ShareSearch from 'registries/services/share-search';

// TODO: allow passing in search results
export function stubRegistriesShareSearch(context: TestContext) {
    const engine = context.owner.lookup('-engine-instance:registries-registries') as EngineInstance;

    const shareSearch = new ShareSearch();
    engine.register('service:share-search', shareSearch, { instantiate: false });
    context.owner.register('service:share-search', shareSearch, { instantiate: false });

    sinon.stub(shareSearch, 'registrations').returns(Promise.resolve({
        total: 420,
        results: [{
            id: '1',
            title: 'Can Potatoes Cause Cancer?',
            description: 'THEY CAN AND THEY WILL',
            mainLink: 'https://example.com/cancer-potatoes',
            contributors: [],
            hyperLinks: [],
            infoLinks: [],
            registrationType: 'baz',
            sources: [],
            subjectSynonyms: [],
            subjects: [],
            tags: [],
            withdrawn: false,
        }, {
            id: '2',
            title: 'Can Potatoes Cure Cancer?',
            description: 'THEY CAN AND THEY WILL',
            mainLink: 'https://example.com/super-potatoes',
            contributors: [],
            hyperLinks: [],
            infoLinks: [],
            registrationType: 'baz',
            sources: [],
            subjectSynonyms: [],
            subjects: [],
            tags: [],
            withdrawn: false,
        }],
        aggregations: {
            sources: {
                buckets: [],
            },
        },
    }));
}
