import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { action } from '@ember/object';

import InstitutionModel from 'ember-osf-web/models/institution';
import SearchResultModel from 'ember-osf-web/models/search-result';
import { AttributionRoleIris } from 'ember-osf-web/models/index-card';
import { getOsfmapObjects, getSingleOsfmapValue, hasOsfmapValue } from 'ember-osf-web/packages/osfmap/jsonld';

interface ContributorsFieldArgs {
    searchResult: SearchResultModel;
    institution: InstitutionModel;
    projectRequestModal: (contributor: any) => void;
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
        const adminAttributions = affiliatedAttributions.filter(
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
            const contributor = getContributorById(contributors, getSingleOsfmapValue(attribution, ['agent']));
            const roleIri: AttributionRoleIris = getSingleOsfmapValue(attribution, ['hadRole']);
            return {
                name: getSingleOsfmapValue(contributor, ['name']) || this.intl.t('general.unknownContributor'),
                userId: contributor['@id'],
                nodeId: searchResult.indexCard.get('osfGuid'),
                url: getSingleOsfmapValue(contributor, ['identifier']),
                permissionLevel: this.intl.t(roleIriToTranslationKey[roleIri]),
            };
        });

    }

    @action
    handleOpenModal(contributor: any) {
        this.args.projectRequestModal(contributor);
    }

    get shouldShowButton() {
        const { searchResult} = this.args;
        const {resourceMetadata} = searchResult;
        return resourceMetadata.resourceType[0]['@id'] === 'Project';
    }
}

function hasInstitutionAffiliation(contributors: any[], attribution: any, institutionIris: string[]) {
    const attributedContributor = getContributorById(contributors, getSingleOsfmapValue(attribution, ['agent']));
    return true;
    if (!attributedContributor.affiliation) {
        return false;
    }

    return attributedContributor.affiliation.some(
        (affiliation: any) => {
            if (affiliation.identifier) {
                return affiliation.identifier.some(
                    (affiliationIdentifier: any) => institutionIris.includes(affiliationIdentifier['@value']),
                );
            }
            return institutionIris.includes(affiliation['@id']);
        },
    );
}

function getContributorById(contributors: any[], contributorId: string) {
    return contributors.find(contributor => contributor['@id'] === contributorId);
}
