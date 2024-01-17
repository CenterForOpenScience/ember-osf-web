import { ModelInstance } from 'ember-cli-mirage';

import { addonServiceAPIUrl } from 'ember-osf-web/adapters/addon-service';
import InternalResourceModel from 'ember-osf-web/models/internal-resource';
import ApplicationSerializer from './application';

export default class InternalResourceSerializer extends ApplicationSerializer<InternalResourceModel> {
    buildRelationships(model: ModelInstance<InternalResourceModel>) {
        return {
            configuredStorageAddons: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}internal-resources/${model.id}/configured-storage-addons`,
                        meta: this.buildRelatedLinkMeta(model, 'configuredStorageAddons'),
                    },
                },
            },
        };
    }

    buildNormalLinks(model: ModelInstance<InternalResourceModel>) {
        return {
            self: `${addonServiceAPIUrl}internal-resources/${model.id}/`,
        };
    }
}
