import { Factory } from 'ember-cli-mirage';

import Identity from 'ember-osf-web/models/identity';

export default Factory.extend<Identity>({
    status: 'VERIFIED',
    externalID: '0000-0001-9143-4653',
    name: 'ORCID',
});
