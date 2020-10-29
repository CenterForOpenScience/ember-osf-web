import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { all, timeout } from 'ember-concurrency';
import { restartableTask, task } from 'ember-concurrency-decorators';
import DS from 'ember-data';

import { layout } from 'ember-osf-web/decorators/component';
import CitationStyle from 'ember-osf-web/models/citation-style';
import Node from 'ember-osf-web/models/node';
import Preprint from 'ember-osf-web/models/preprint';
import CurrentUser from 'ember-osf-web/services/current-user';
import fixSpecialChars from 'ember-osf-web/utils/fix-special-char';
import getRelatedHref from 'ember-osf-web/utils/get-related-href';
import { addPathSegment } from 'ember-osf-web/utils/url-parts';
import { SingleResourceDocument } from 'osf-api';

import template from './template';

interface DefaultCitation {
    id: string;
    displayTitle: string;
    citation?: string;
}

const defaultCitations: DefaultCitation[] = [
    { id: 'apa', displayTitle: 'APA' },
    { id: 'modern-language-association', displayTitle: 'MLA' },
    { id: 'chicago-author-date', displayTitle: 'Chicago' },
];

function citationUrl(citable: Node | Preprint, citationStyleId: string) {
    const relatedHref = getRelatedHref(citable.links.relationships!.citation);

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

    // Private properties
    @service store!: DS.Store;
    @service currentUser!: CurrentUser;

    selectedCitationStyle?: CitationStyle;

    @task({ withTestWaiter: true, on: 'init' })
    async loadDefaultCitations() {
        const responses: SingleResourceDocument[] = await all(
            defaultCitations.map(
                c => this.currentUser.authenticatedAJAX({ url: citationUrl(this.citable, c.id) }),
            ),
        );
        return responses.map((r, i) => ({
            ...defaultCitations[i],
            citation: typeof r.data.attributes!.citation === 'string'
                ? fixSpecialChars(r.data.attributes!.citation)
                : r.data.attributes!.citation,
        }));
    }

    @restartableTask({ withTestWaiter: true })
    async searchCitationStyles(query: string) {
        await timeout(1000); // debounce

        const citationSearchResults = await this.store.query('citation-style', {
            'filter[title,short_title]': query,
            'page[size]': 100,
        });
        return citationSearchResults;
    }

    @restartableTask({ withTestWaiter: true })
    async renderCitation(citationStyle: CitationStyle) {
        this.set('selectedCitationStyle', citationStyle);

        const response: SingleResourceDocument = await this.currentUser.authenticatedAJAX({
            url: citationUrl(this.citable, citationStyle.id),
        });
        const citationString = response.data.attributes!.citation;
        return typeof citationString === 'string' ? fixSpecialChars(citationString) : citationString;
    }
}
