import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

import InstitutionModel from 'ember-osf-web/models/institution';
import SearchResultModel from 'ember-osf-web/models/search-result';
import { AttributionRoleIris } from 'ember-osf-web/models/index-card';

interface ContributorsFieldArgs {
    searchResult: SearchResultModel;
    institution: InstitutionModel;
}

const roleIriToTranslationKey: Record<AttributionRoleIris, string> = {
    [AttributionRoleIris.Admin]: 'general.permissions.admin',
    [AttributionRoleIris.Write]: 'general.permissions.write',
    [AttributionRoleIris.Read]: 'general.permissions.read',
};


export default class InstitutionalObjectListContributorsField extends Component<ContributorsFieldArgs> {
    @service intl!: Intl;

    // Return two contributors affiliated with the institution given with highest permission levels
    get topInstitutionAffiliatedContributors() {
        const { searchResult, institution } = this.args;
        const attributions: any[] = searchResult.resourceMetadata.qualifiedAttribution;
        const institutionIris = institution.iris;
        const affiliatedAttributions = attributions
            .filter((attribution: any) => hasInstitutionAffiliation(attribution, institutionIris));
        const adminAttributions = affiliatedAttributions
            .filter(attribution => attribution.hadRole[0]['@id'] === AttributionRoleIris.Admin);
        const writeAttributions = affiliatedAttributions
            .filter(attribution => attribution.hadRole[0]['@id'] === AttributionRoleIris.Write);
        const readAttributions = affiliatedAttributions
            .filter(attribution => attribution.hadRole[0]['@id'] === AttributionRoleIris.Read);

        const prioritizedAttributions = adminAttributions.concat(writeAttributions, readAttributions);

        return prioritizedAttributions.slice(0, 2).map((attribution: any) => {
            const roleIri: AttributionRoleIris = attribution.hadRole[0]['@id'];
            return {
                name: attribution.agent[0].name[0]['@value'],
                url: attribution.agent[0]['@id'],
                permissionLevel: this.intl.t(roleIriToTranslationKey[roleIri]),
            };
        });
    }
}

function hasInstitutionAffiliation(contributor: any, institutionIris: string[]) {
    return contributor.agent[0].affiliation.some(
        (affiliation: any) => affiliation.identifier.some(
            (affiliationIdentifier: any) => institutionIris.includes(affiliationIdentifier['@value']),
        ),
    );
}
