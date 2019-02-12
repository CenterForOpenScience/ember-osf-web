import { Factory, faker } from 'ember-cli-mirage';

import CollectionProvider from 'ember-osf-web/models/collection-provider';

import { guid, guidAfterCreate } from './utils';
import { randomGravatar } from 'ember-osf-web/mirage/utils';

export default Factory.extend<CollectionProvider>({
    id: guid('collection-provider'),
    afterCreate: guidAfterCreate,
    advisoryBoard: faker.lorem.paragraph,
    emailSupport: '',
    name: faker.lorem.word,
    domain: faker.internet.domainName,
    allowCommenting: false,
    assets: {
        square_color_no_transparent: randomGravatar(100),
    },
    facebookAppId: '',
    footerLinks: '',
    allowSubmissions: true,
    example: '',
    domainRedirectEnabled: false,
    description: faker.lorem.paragraph,
});
