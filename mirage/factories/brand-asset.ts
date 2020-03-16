import { Factory } from 'ember-cli-mirage';

import BrandAsset from 'ember-osf-web/models/brand-asset';

export default Factory.extend<BrandAsset>({
    primaryColor: 'green',
    secondaryColor: 'blue',
    navbarLogoImage: 'http://somelogoimageurl',
    heroLogoImage: 'http://somelogoimageurl',
    heroBackgroundImage: 'http://herobackgroundimage',
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        brandAsset: BrandAsset;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        brandAsset: BrandAsset;
    } // eslint-disable-line semi
}
