import Component from '@glimmer/component';

import InstitutionModel from 'ember-osf-web/models/institution';
import SearchResultModel from 'ember-osf-web/models/search-result';
import { AttributionRoles } from 'ember-osf-web/models/index-card';

interface ContributorsFieldArgs {
    searchResult: SearchResultModel;
    institution: InstitutionModel;
}

export default class InstitutionalObjectListContributorsField extends Component<ContributorsFieldArgs> {
    // Return two contributors affiliated with the institution given with highest permission levels
    get topInstitutionAffiliatedContributors() {
        const { searchResult, institution } = this.args;
        const contributors: any[] = searchResult.resourceMetadata.qualifiedAttribution;
        const institutionIris = institution.iris;
        const affiliatedContributors = contributors
            .filter((contributor: any) => hasInstitutionAffiliation(contributor, institutionIris));
        const adminContributors = affiliatedContributors
            .filter(contributor => contributor.hadRole[0]['name'][0]['@value'] === AttributionRoles.Admin);
        const writeContributors = affiliatedContributors
            .filter(contributor => contributor.hadRole[0]['name'][0]['@value'] === AttributionRoles.Write);
        const readContributors = affiliatedContributors
            .filter(contributor => contributor.hadRole[0]['name'][0]['@value'] === AttributionRoles.Read);

        const prioritizedContributors = adminContributors.concat(writeContributors, readContributors);

        return prioritizedContributors.slice(0, 2).map((contributor: any) => ({
            name: contributor.agent[0].name[0]['@value'],
            url: contributor.agent[0]['@id'],
            permissionLevel: contributor.hadRole[0]['name'][0]['@value'],
        }));
    }

}

function hasInstitutionAffiliation(contributor: any, institutionIris: string[]) {
    return contributor.agent[0].affiliation.some(
        (affiliation: any) => affiliation.identifier.some(
            (affiliationIdentifier: any) => institutionIris.includes(affiliationIdentifier['@value']),
        ),
    );
}
