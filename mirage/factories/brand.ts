import { Factory, faker } from 'ember-cli-mirage';

import { placekitten } from 'ember-osf-web/mirage/utils';
import Brand from 'ember-osf-web/models/brand';

export default Factory.extend<Brand>({
    primaryColor() {
        return faker.internet.color();
    },
    secondaryColor() {
        return faker.internet.color();
    },
    topnavLogoImage(i: number) {
        return placekitten(30, 30, i);
    },
    heroLogoImage(i: number) {
        return placekitten(300, 60, i);
    },
    heroBackgroundImage(i: number) {
        return placekitten(1350, 900, i);
    },
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
