import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

import InstitutionModel from 'ember-osf-web/models/institution';
import SearchResultModel from 'ember-osf-web/models/search-result';
import { AttributionRoleIris } from 'ember-osf-web/models/index-card';
import { getOsfmapObjects, getSingleOsfmapValue, hasOsfmapValue } from 'ember-osf-web/packages/osfmap/jsonld';

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
        const {resourceMetadata} = searchResult;
        const attributions: any[] = getOsfmapObjects(resourceMetadata, ['qualifiedAttribution']);
        const contributors = getOsfmapObjects(resourceMetadata, ['creator']);
        const institutionIris = institution.iris;
        const affiliatedAttributions = attributions
            .filter((attribution: any) => hasInstitutionAffiliation(contributors, attribution, institutionIris));
        const adminAttributions = attributions.filter(
            attribution => hasOsfmapValue(attribution, ['hadRole'], AttributionRoleIris.Admin),
        );
        const writeAttributions = affiliatedAttributions.filter(
            attribution => hasOsfmapValue(attribution, ['hadRole'], AttributionRoleIris.Write),
        );
        const readAttributions = affiliatedAttributions.filter(
            attribution => hasOsfmapValue(attribution, ['hadRole'], AttributionRoleIris.Read),
        );

        const prioritizedAttributions = adminAttributions.concat(writeAttributions, readAttributions);

        return prioritizedAttributions.slice(0, 2).map(attribution => {
            const attributedContributor = contributors.find(
                (contributor: any) => contributor['@id'] === getSingleOsfmapValue(attribution,['agent']),
            );
            const roleIri: AttributionRoleIris = getSingleOsfmapValue(attribution, ['hadRole']);
            return {
                name: getSingleOsfmapValue(attributedContributor,['name']),
                url: getSingleOsfmapValue(attributedContributor, ['identifier']),
                permissionLevel: this.intl.t(roleIriToTranslationKey[roleIri]),
            };
        });
    }
}

function hasInstitutionAffiliation(contributors: any[], attribution: any, institutionIris: string[]) {
    const attributedContributor = contributors
        .filter((contributor: any) => contributor['@id'] === attribution.agent[0]['@id']);

    return attributedContributor[0].affiliation.some(
        (affiliation: any) => affiliation.identifier.some(
            (affiliationIdentifier: any) => institutionIris.includes(affiliationIdentifier['@value']),
        ),
    );
}
