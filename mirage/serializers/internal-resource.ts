import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';

import InternalResourceModel from 'ember-osf-web/models/internal-resource';

import ApplicationSerializer from './application';

const { addonServiceUrl } = config.OSF;

export default class InternalResourceSerializer extends ApplicationSerializer<InternalResourceModel> {
    buildRelationships(model: ModelInstance<InternalResourceModel>) {
        return {
            configuredStorageAddons: {
                links: {
                    related: {
                        href: `${addonServiceUrl}/osf_resources/${model.id}/configured_storage_addons`,
                        meta: this.buildRelatedLinkMeta(model, 'configuredStorageAddons'),
                    },
                },
            },
        };
    }

    buildNormalLinks(model: ModelInstance<InternalResourceModel>) {
        return {
            self: `${addonServiceUrl}/osf_resources/${model.id}/`,
        };
    }
}
