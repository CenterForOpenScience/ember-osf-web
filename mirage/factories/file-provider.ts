import { Factory, ID } from 'ember-cli-mirage';

import FileProviderModel from 'ember-osf-web/models/file-provider';

export interface MirageFileProvider extends FileProviderModel {
    providerId: string;
    targetId: { id: ID, type: 'draft-nodes' | 'nodes' };
}

export default Factory.extend<MirageFileProvider>({
    name: 'osfstorage',
    path: '/',
    provider: 'osfstorage',
    afterCreate(provider, server) {
        provider.update({
            providerId: `${provider.targetId.id}:${provider.name}`,
        });

        const rootFolder = server.create('file', 'asFolder');
        provider.update({ rootFolder });
    },
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        fileProviders: MirageFileProvider;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        fileProviders: MirageFileProvider;
    } // eslint-disable-line semi
}
