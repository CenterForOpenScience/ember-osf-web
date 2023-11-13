import { Factory } from 'ember-cli-mirage';

import NodeAddonModel from 'ember-osf-web/models/node-addon';

export default Factory.extend<NodeAddonModel>({
    nodeHasAuth: false,
    configured: false,
    folderId: null,
    folderPath: null,
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        'node-addon': NodeAddonModel;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        nodeAddons: NodeAddonModel;
    } // eslint-disable-line semi
}
