import Component from '@glimmer/component';

import InstitutionModel from 'ember-osf-web/models/institution';
import SearchResultModel from 'ember-osf-web/models/search-result';

interface ContributorsFieldArgs {
    searchResult: SearchResultModel;
    institution: InstitutionModel;
}

export default class InstitutionalObjectListContributorsField extends Component<ContributorsFieldArgs> {
    // Return two contributors affiliated with the institution given with highest permission levels
    get topInstitutionAffiliatedContributors() {
        const { searchResult, institution } = this.args;
        const contributors: any[] = searchResult.resourceMetadata.creator;
        const institutionIris = institution.iris;
        const affiliatedContributors = contributors
            .filter((contributor: any) => hasInstitutionAffiliation(contributor, institutionIris));
        // TODO: get the two users with the highest permission level and add permission to the return object
        return affiliatedContributors.slice(0, 2).map((contributor: any) => ({
            name: contributor.name[0]['@value'],
            url: contributor['@id'],
        }));
    }

}

function hasInstitutionAffiliation(contributor: any, institutionIris: string[]) {
    return contributor.affiliation.some(
        (affiliation: any) => affiliation.identifier.some(
            (affiliationIdentifier: any) => institutionIris.includes(affiliationIdentifier['@value']),
        ),
    );
}
