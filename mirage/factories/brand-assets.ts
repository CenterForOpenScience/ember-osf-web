import { Factory } from 'ember-cli-mirage';

import BrandAssets from 'ember-osf-web/models/brand-assets';

export default Factory.extend<BrandAssets>({
    primaryColor: 'green',
    secondaryColor: 'blue',
    navbarLogoImage: 'http://somelogoimageurl',
    heroLogoImage: 'http://somelogoimageurl',
    heroBackgroundImage: 'http://herobackgroundimage',
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        brandAssets: BrandAssets;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        brandAssets: BrandAssets;
    } // eslint-disable-line semi
}
