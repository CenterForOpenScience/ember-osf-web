import { Factory } from 'ember-cli-mirage';

import FileProviderModel from 'ember-osf-web/models/file-provider';
import { PolymorphicTargetRelationship } from '../factories/file';

export interface MirageFileProvider extends FileProviderModel {
    providerId: string;
    targetId: PolymorphicTargetRelationship;
}

export default Factory.extend<MirageFileProvider>({
    name: 'osfstorage',
    path: '/',
    provider: 'osfstorage',
    afterCreate(provider, server) {
        provider.update({
            providerId: `${provider.targetId.id}:${provider.name}`,
        });

        const rootFolder = server.create('file', {
            name: `rootfolder of ${provider.name}`,
            target: provider.target,
        }, 'asFolder');
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
