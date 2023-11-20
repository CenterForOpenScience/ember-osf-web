import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-osf-web/config/environment';

import OsfResourceModel from 'ember-osf-web/models/osf-resource';

import ApplicationSerializer from './application';

const { addonServiceUrl } = config.OSF;

export default class OsfResourceSerializer extends ApplicationSerializer<OsfResourceModel> {
    buildRelationships(model: ModelInstance<OsfResourceModel>) {
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

    buildNormalLinks(model: ModelInstance<OsfResourceModel>) {
        return {
            self: `${addonServiceUrl}/osf_resources/${model.id}/`,
        };
    }
}
