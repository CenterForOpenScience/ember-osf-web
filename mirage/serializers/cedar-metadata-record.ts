import { ModelInstance } from 'ember-cli-mirage';
import CedarMetadataRecordModel from 'ember-osf-web/models/cedar-metadata-record';
import config from 'ember-osf-web/config/environment';
import ApplicationSerializer, { SerializedRelationships } from './application';
const { OSF: { apiUrl } } = config;

export interface PolymorphicTargetRelationship {
    type: 'nodes' | 'files' | 'registrations';
}

export interface MirageCedarMetadataRecordModel extends CedarMetadataRecordModel {
    targetId: PolymorphicTargetRelationship;
}

export default class CedarMetadataRecordMirageSerializer extends ApplicationSerializer<MirageCedarMetadataRecordModel> {
    buildNormalLinks(model: ModelInstance<MirageCedarMetadataRecordModel>) {
        return {
            self: `${apiUrl}/_/cedar_metadata_records/${model.id}/`,
        };
    }

    buildRelationships(model: ModelInstance<MirageCedarMetadataRecordModel>) {
        const relationships: SerializedRelationships<MirageCedarMetadataRecordModel> = {
            template: {
                links: {
                    related: {
                        href: `${apiUrl}/_/cedar_metadata_templates/${model.template.id}/`,
                        meta: this.buildRelatedLinkMeta(model, 'template'),
                    },
                },
            },
        };

        // console.log('type', model.targetId.type);

        if (model.targetId.type === 'nodes') {
            // console.log('node');
            relationships['target'] = {
                data: {
                    id: model.target.id,
                    type: 'nodes',
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/nodes/${model.target.id}/`,
                        meta: this.buildRelatedLinkMeta(model, 'target'),
                    },
                },
            };
        } else if (model.targetId.type === 'files') {
            // console.log('file');
            relationships['target'] = {
                data: {
                    id: model.target.id,
                    type: 'files',
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/files/${model.target.id}/`,
                        meta: this.buildRelatedLinkMeta(model, 'target'),
                    },
                },
            };
        } else {
            // console.log('else', model.targetId.type);
            relationships['target'] = {
                data: {
                    id: model.target.id,
                    type: 'registrations',
                },
                links: {
                    related: {
                        href: `${apiUrl}/v2/registrations/${model.target.id}/`,
                        meta: this.buildRelatedLinkMeta(model, 'target'),
                    },
                },
            };
        }

        return relationships;
    }
}
