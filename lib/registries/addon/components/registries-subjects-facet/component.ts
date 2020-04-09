import { action } from '@ember/object';
import Component from '@glimmer/component';

import ProviderModel from 'ember-osf-web/models/provider';
import SubjectModel from 'ember-osf-web/models/subject';
import { SubjectManager } from 'osf-components/components/subjects/manager/component';
import { SearchOptions } from 'registries/services/search';
import { ShareTermsFilter } from 'registries/services/share-search';

interface Args {
    provider: ProviderModel;
    searchOptions: SearchOptions;
    onSearchOptionsUpdated(options: SearchOptions): void;
}

// TODO: memoize? could get expensive
// WARNING: assumes subject.parent (and subject.parent.parent...) is already loaded
function getSubjectTerm(subject: SubjectModel): string {
    // subjects are indexed with their full hierarchy, including taxonomy name
    // 'taxonomy|parent subject text|this subject text'
    // e.g. 'bepress|Law|Bird Law'
    const parentSubject = subject.belongsTo('parent').value() as SubjectModel | null;

    return parentSubject ?
        `${getSubjectTerm(parentSubject)}|${subject.text}` :
        `${subject.taxonomyName}|${subject.text}`;
}

function newSubjectFilter(subject: SubjectModel): ShareTermsFilter {
    // TODO: not subject.text, gotta get the whole taxonomy...
    return new ShareTermsFilter('subjects', getSubjectTerm(subject), subject.text);
}

export default class RegistriesSubjectsFacet extends Component<Args> {
    get subjectsManager(): Partial<SubjectManager> {
        const {
            args: { provider },
            selectSubject,
            unselectSubject,
            subjectIsSelected,
            subjectHasSelectedChildren,
        } = this;

        return {
            provider,
            selectSubject,
            unselectSubject,
            subjectIsSelected,
            subjectHasSelectedChildren,

            subjectIsSaved: () => false, // TODO: should this return true?

            // NOTE: everything below is not needed by Subjects::Browse, so they're
            // just here to fit the interface that assumes we're saving subjects
            // on a model instance
            /*
            savedSubjects: [],
            selectedSubjects: [],
            isSaving: false,
            hasChanged: false,
            discardChanges: () => undefined,
            saveChanges: () => Promise.resolve(),
            */
        };
    }

    @action
    subjectIsSelected(subject: SubjectModel): boolean {
        const { searchOptions: { filters } } = this.args;

        const subjectFilter = newSubjectFilter(subject);
        return filters.contains(subjectFilter);
    }

    @action
    subjectHasSelectedChildren(/* subject: SubjectModel */): boolean {
        // TODO
        return false;
    }

    @action
    selectSubject(subject: SubjectModel): void {
        const {
            searchOptions,
            onSearchOptionsUpdated,
        } = this.args;

        const filterToAdd = newSubjectFilter(subject);

        onSearchOptionsUpdated(
            searchOptions.addFilters(filterToAdd),
        );
    }

    @action
    unselectSubject(subject: SubjectModel): void {
        const {
            searchOptions,
            onSearchOptionsUpdated,
        } = this.args;

        const filterToRemove = newSubjectFilter(subject);

        onSearchOptionsUpdated(
            searchOptions.removeFilters(filterToRemove),
        );
    }
}
