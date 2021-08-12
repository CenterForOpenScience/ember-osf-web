import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

import { randomGravatar } from 'ember-osf-web/mirage/utils';
import CollectionProvider from 'ember-osf-web/models/collection-provider';

import { guid, guidAfterCreate } from './utils';

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
    description() {
        return `${faker.lorem.paragraph()} Find out <a href="https://help.osf.io/">more</a>.`;
    },
});
