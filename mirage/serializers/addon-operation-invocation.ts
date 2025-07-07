import { ModelInstance } from 'ember-cli-mirage';

import { addonServiceAPIUrl } from 'ember-osf-web/adapters/addon-service';
import AddonOperationInvocations from 'ember-osf-web/models/addon-operation-invocation';

import AddonServiceSerializer from './addon-service';

interface PolyMorphicAccountType {
    type: 'authorized-storage-account' | 'authorized-citation-account' | 'authorized-computing-account';
    id: string;
}

interface PolyMorphicAddonType {
    type: 'configured-storage-addon' | 'configured-citation-addon' | 'configured-computing-addon';
    id: string;
}

export interface MirageAddonOperationInvocation extends AddonOperationInvocations {
    byUserId: string;
    thruAccountId: PolyMorphicAccountType;
    thruAddonId: PolyMorphicAddonType;
}

export default class AddonOperationInvocationSerializer extends AddonServiceSerializer<MirageAddonOperationInvocation> {
    buildRelationships(model: ModelInstance<MirageAddonOperationInvocation>) {
        const relationships =  {
            byUser: {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}user-references/${model.byUserId}/`,
                    },
                },
                data: {
                    type: 'user-references',
                    id: model.byUserId,
                },
            },
        };
        if (model.thruAccountId) {
            const thruAccountType = model.thruAccountId.type;
            relationships.thruAccount =  {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}${thruAccountType}/${model.thruAccountId}/`,
                    },
                },
                data: {
                    type: thruAccountType,
                    id: model.thruAccountId,
                },
            };
        } else {
            const thruAddonType = model.thruAddonId.type;
            relationships.thruAddon = {
                links: {
                    related: {
                        href: `${addonServiceAPIUrl}${thruAddonType}/${model.thruAddonId}/`,
                    },
                },
                data: {
                    type: thruAddonType,
                    id: model.thruAddonId,
                },
            };
        }
        return relationships;
    }
}
