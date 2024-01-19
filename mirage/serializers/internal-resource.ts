import { ModelInstance } from 'ember-cli-mirage';

import { addonServiceAPIUrl } from 'ember-osf-web/adapters/addon-service';
import InternalResourceModel from 'ember-osf-web/models/internal-resource';
import AddonServiceSerializer from './addon-service-serializer';

export default class InternalResourceSerializer extends AddonServiceSerializer {
    buildRelationships(model: ModelInstance<InternalResourceModel>) {
        return {
            configuredStorageAddons: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}internal-resources/${model.id}/configured-storage-addons`,
                    },
                },
            },
        };
    }
}
