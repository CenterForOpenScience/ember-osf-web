import { Factory } from 'ember-cli-mirage';

import FileProviderModel from 'ember-osf-web/models/file-provider';

export interface MirageFileProvider extends FileProviderModel {
    providerId: string;
}

export default Factory.extend<MirageFileProvider>({
    name: 'osfstorage',
    path: '/',
    provider: 'osfstorage',
    afterCreate(provider, server) {
        if (provider.node) {
            provider.update({
                providerId: `${provider.node.id}:${provider.name}`,
            });
        }
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
