import Store from '@ember-data/store';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { all, restartableTask, task, timeout } from 'ember-concurrency';

import { layout } from 'ember-osf-web/decorators/component';
import CitationStyleModel from 'ember-osf-web/models/citation-style';
import CitationStyle from 'ember-osf-web/models/citation-style';
import Node from 'ember-osf-web/models/node';
import Preprint from 'ember-osf-web/models/preprint';
import ProviderModel from 'ember-osf-web/models/provider';
import CurrentUser from 'ember-osf-web/services/current-user';
import fixSpecialChars from 'ember-osf-web/utils/fix-special-char';
import getRelatedHref from 'ember-osf-web/utils/get-related-href';
import { addPathSegment } from 'ember-osf-web/utils/url-parts';
import { SingleResourceDocument } from 'osf-api';

import template from './template';

interface DefaultCitation {
    id: string;
    title: string;
    citation?: string;
}

const defaultCitations: DefaultCitation[] = [
    { id: 'apa', title: 'APA' },
    { id: 'modern-language-association', title: 'MLA' },
    { id: 'chicago-author-date', title: 'Chicago' },
];

function citationUrl(citable: Node | Preprint, citationStyleId: string) {
    const relatedHref = getRelatedHref(citable?.links.relationships!.citation);

    if (!relatedHref) {
        throw Error('Error getting citation URL');
    }

    return addPathSegment(
        relatedHref,
        citationStyleId,
    );
}

@layout(template)
export default class CitationViewer extends Component {
    // Required parameter
    citable!: Node | Preprint;

    // Optional parameter
    provider?: ProviderModel;

    // Private properties
    @service store!: Store;
    @service currentUser!: CurrentUser;

    selectedCitationStyle?: CitationStyle;

    @restartableTask
    @waitFor
    async renderCitation(citationStyle: CitationStyle) {
        this.set('selectedCitationStyle', citationStyle);

        const response: SingleResourceDocument = await this.currentUser.authenticatedAJAX({
            url: citationUrl(this.citable, citationStyle.id),
        });
        const citationString = response.data.attributes!.citation;
        return typeof citationString === 'string' ? fixSpecialChars(citationString) : citationString;
    }

    @task({ on: 'init' })
    @waitFor
    async loadDefaultCitations() {
        let citations: CitationStyleModel[] | DefaultCitation[] = [];
        if (this.provider) {
            citations = (await this.provider.citationStyles).toArray();
        }
        if (citations.length === 0) {
            citations = defaultCitations;
        }
        const responses: SingleResourceDocument[] = await all(
            citations.map(
                c => this.currentUser.authenticatedAJAX({ url: citationUrl(this.citable, c.id) }),
            ),
        );
        return responses.map((r, i) => ({
            ...citations[i],
            title: citations[i].title,
            citation: typeof r.data.attributes!.citation === 'string'
                ? fixSpecialChars(r.data.attributes!.citation)
                : r.data.attributes!.citation,
        }));
    }

    @restartableTask
    @waitFor
    async searchCitationStyles(query: string) {
        await timeout(1000); // debounce

        const citationSearchResults = await this.store.query('citation-style', {
            'filter[title,short_title]': query,
            'page[size]': 100,
        });
        return citationSearchResults;
    }
}
