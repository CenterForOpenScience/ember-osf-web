import { Factory } from 'ember-cli-mirage';
import { MirageExternalProvider } from 'ember-osf-web/mirage/models/external-provider';
import faker from 'faker';

export default Factory.extend<MirageExternalProvider>({
    shareSourceKey() {
        return faker.random.words(2);
    },
});
