import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Model, { AsyncHasMany, attr, hasMany } from '@ember-data/model';
import { dropTask } from 'ember-concurrency';
import IntlService from 'ember-intl/services/intl';

import GetLocalizedPropertyHelper from 'ember-osf-web/helpers/get-localized-property';
import config from 'ember-osf-web/config/environment';
import OsfModel from 'ember-osf-web/models/osf-model';
import { tracked } from 'tracked-built-ins';
const osfUrl = config.OSF.url;

export interface LanguageText {
    '@language': string;
    '@value': string;
}

export default class IndexCardModel extends Model {
    @service intl!: IntlService;

    @attr('array') resourceType!: string[];
    @attr('array') resourceIdentifier!: string[];
    // TODO: can we add a type for resourceMetadata?
    @attr('object') resourceMetadata!: any;

    @hasMany('index-card', { inverse: null })
    relatedRecordSet!: AsyncHasMany<IndexCardModel> & IndexCardModel[];

    getLocalizedString = new GetLocalizedPropertyHelper(getOwner(this));

    @tracked osfModel?: OsfModel;

    get resourceId() {
        return this.resourceIdentifier[0];
    }

    get osfModelType() {
        const types = this.resourceMetadata.resourceType.map( (item: any) => item['@id']);
        if (types.includes('Project') || types.includes('ProjectComponent')) {
            return 'node';
        } else if (types.includes('Registration') || types.includes('RegistrationComponent')) {
            return 'registration';
        } else if (types.includes('Preprint')) {
            return 'preprint';
        } else if (types.includes('Person') || types.includes('Agent')) {
            return 'user';
        } else if(types.includes('File')) {
            return 'file';
        }
        return null;
    }

    get label() {
        const possibleLabelKeys = ['displayLabel', 'name', 'title'];
        for (const key of possibleLabelKeys) {
            if (this.resourceMetadata[key]) {
                const label = this.getLocalizedString.compute([this.resourceMetadata, key]);
                // TODO: Get rid of this special casing once we have a decision on how BE should represents OSF provider
                if (label === 'OSF') {
                    return 'OSF Projects';
                }
                if (label === 'Open Science Framework') {
                    return 'OSF Preprints';
                }
                return label;
            }
        }
        return '';
    }

    @dropTask
    @waitFor
    async getOsfModel() {
        const identifier = this.resourceIdentifier;
        if (identifier && this.osfModelType) {
            const guid = this.guidFromIdentifierList(identifier);
            const relatedCounts = this.osfModelType === 'user' ? 'nodes,registrations,preprints' : '';
            if (guid) {
                const osfModel = await this.store.findRecord(this.osfModelType, guid, {
                    adapterOptions: {
                        query: {
                            related_counts: relatedCounts,
                        },
                    },
                    reload: true,
                });
                this.osfModel = osfModel;
            }
        }
    }

    guidFromIdentifierList(ids: string[]) {
        for (const iri of ids) {
            if (iri && iri.startsWith(osfUrl)) {
                const pathSegments = iri.slice(osfUrl.length).split('/').filter(Boolean);
                if (pathSegments.length === 1) {
                    return pathSegments[0];  // one path segment; looks like osf-id
                }
            }
        }
        return null;
    }
}

declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
        'index-card': IndexCardModel;
    } // eslint-disable-line semi
}
