import { Factory, faker } from 'ember-cli-mirage';
import { MirageExternalProvider } from 'ember-osf-web/mirage/models/external-provider';

export default Factory.extend<MirageExternalProvider>({
    shareSourceKey() {
        return faker.random.words(2);
    },
});
