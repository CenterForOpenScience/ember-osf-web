import { Factory } from 'ember-cli-mirage';

import Brand from 'ember-osf-web/models/brand';

export default Factory.extend<Brand>({
    primaryColor: 'green',
    secondaryColor: 'blue',
    navbarLogoImage: 'http://somelogoimageurl',
    heroLogoImage: 'http://somelogoimageurl',
    heroBackgroundImage: 'http://herobackgroundimage',
});

declare module 'ember-cli-mirage/types/registries/model' {
    export default interface MirageModelRegistry {
        brand: Brand;
    } // eslint-disable-line semi
}

declare module 'ember-cli-mirage/types/registries/schema' {
    export default interface MirageSchemaRegistry {
        brand: Brand;
    } // eslint-disable-line semi
}
