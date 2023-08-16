import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

import ProviderModel from 'ember-osf-web/models/provider';
import SubjectModel from 'ember-osf-web/models/subject';
import Analytics from 'ember-osf-web/services/analytics';
import { SubjectManager } from 'osf-components/components/subjects/manager/component';
import { SearchOptions } from 'registries/services/search';
import { ShareTermsFilter } from 'registries/services/share-search';

interface Args {
    provider: ProviderModel;
    searchOptions: SearchOptions;
    onSearchOptionsUpdated(options: SearchOptions): void;
}

// TODO: memoize some of these functions? could get expensive with lots of subjects expanded

// WARNING: assumes subject.parent (and subject.parent.parent...) is already loaded
function getSubjectTerm(subject: SubjectModel): string {
    // subjects are indexed with their full hierarchy, including taxonomy name
    // 'taxonomy|parent subject text|this subject text'
    // e.g. 'bepress|Law|Bird Law'
    const parentSubject = subject.belongsTo('parent').value() as SubjectModel | null;

    return parentSubject
        ? `${getSubjectTerm(parentSubject)}|${subject.text}`
        : `${subject.taxonomyName}|${subject.text}`;
}

function newSubjectFilter(subject: SubjectModel): ShareTermsFilter {
    return new ShareTermsFilter('subjects', getSubjectTerm(subject), subject.text);
}

/* want to get filters for all ancestors, e.g.
 *  given `bepress|foo|bar|baz`
 *  get [`bepress|foo`, `bepress|foo|bar`]
 */
function getAncestry(subjectTerm: string): string[] {
    const parentTerms: string[] = [];
    const [taxonomyName, ...subjectAncestry] = subjectTerm.split('|');
    for (let i = 1; i < subjectAncestry.length; i++) {
        const ancestorLineage = subjectAncestry.slice(0, i).join('|');
        parentTerms.push(`${taxonomyName}|${ancestorLineage}`);
    }
    return parentTerms;
}

function getAncestryFilters(subjectTerm: string): ShareTermsFilter[] {
    const parentFilters: ShareTermsFilter[] = [];
    const [taxonomyName, ...subjectAncestry] = subjectTerm.split('|');
    for (let i = 1; i < subjectAncestry.length; i++) {
        const ancestorText = subjectAncestry[i];
        const ancestorLineage = subjectAncestry.slice(0, i).join('|');
        parentFilters.push(new ShareTermsFilter(
            'subjects',
            `${taxonomyName}|${ancestorLineage}`,
            ancestorText,
        ));
    }
    return parentFilters;
}

export default class RegistriesSubjectsFacet extends Component<Args> {
    @service analytics!: Analytics;

    provider?: ProviderModel;

    get selectedSubjectFilters() {
        const { searchOptions: { filters } } = this.args;
        return filters.filter(f => f.key === 'subjects').toArray();
    }

    get selectedSubjectTerms(): Set<string> {
        return new Set(
            this.selectedSubjectFilters.map(f => f.value as string),
        );
    }

    get parentTermsWithSelectedChild(): Set<string> {
        const { selectedSubjectTerms } = this;
        const parentTerms = new Set<string>();

        selectedSubjectTerms.forEach(
            subjectTerm => getAncestry(subjectTerm).forEach(
                ancestorTerm => parentTerms.add(ancestorTerm),
            ),
        );

        return parentTerms;
    }

    get subjectsManager(): SubjectManager {
        const {
            args: { provider },
            selectSubject,
            unselectSubject,
            selectedSubjectTerms,
            parentTermsWithSelectedChild,
        } = this;

        return {
            provider,
            selectSubject,
            unselectSubject,

            subjectIsSelected(subject: SubjectModel): boolean {
                // display a subject as selected if any of its children are selected
                return selectedSubjectTerms.has(getSubjectTerm(subject))
                    || parentTermsWithSelectedChild.has(getSubjectTerm(subject));
            },

            subjectHasSelectedChildren(subject: SubjectModel) {
                return parentTermsWithSelectedChild.has(getSubjectTerm(subject));
            },

            subjectIsSaved: () => false, // TODO: should this return true?

            // NOTE: everything below is not needed by Subjects::Browse, so they're
            // just here to fit the interface that assumes we're saving subjects
            // on a model instance
            savedSubjects: [],
            selectedSubjects: [],
            isSaving: false,
            hasChanged: false,
            discardChanges: () => undefined,
            saveChanges: () => Promise.resolve(),
        };
    }

    @action
    selectSubject(subject: SubjectModel): void {
        const {
            searchOptions,
            onSearchOptionsUpdated,
        } = this.args;

        if (this.provider) {
            this.analytics.track(
                'filter',
                'add',
                `Discover - subject ${subject.text} ${this.provider.name}`,
            );
        } else {
            this.analytics.track('filter', 'add', `Discover - subject ${subject.taxonomyName}`);
        }

        const filterToAdd = newSubjectFilter(subject);
        const subjectTerm = getSubjectTerm(subject);
        const parentFilters = getAncestryFilters(subjectTerm);

        onSearchOptionsUpdated(searchOptions.addFilters(filterToAdd, ...parentFilters));
    }

    @action
    unselectSubject(subject: SubjectModel): void {
        const {
            args: {
                searchOptions,
                onSearchOptionsUpdated,
            },
            selectedSubjectFilters,
        } = this;

        if (this.provider) {
            this.analytics.track(
                'filter',
                'remove',
                `Discover - subject ${subject.text} ${this.provider.name}`,
            );
        } else {
            this.analytics.track('filter', 'remove', `Discover - subject ${subject.taxonomyName}`);
        }

        const subjectTerm = getSubjectTerm(subject);

        const filtersToRemove = selectedSubjectFilters.filter(
            f => (f.value as string).startsWith(subjectTerm),
        );

        onSearchOptionsUpdated(searchOptions.removeFilters(...filtersToRemove));
    }
}
