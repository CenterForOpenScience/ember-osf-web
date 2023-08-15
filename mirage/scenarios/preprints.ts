import { ModelInstance, Server } from 'ember-cli-mirage';

import PreprintProvider from 'ember-osf-web/models/preprint-provider';
import User from 'ember-osf-web/models/user';

export function preprintsScenario(
    server: Server,
    currentUser: ModelInstance<User>,
) {
    const thesisCommons = server.schema.preprintProviders.find('thesiscommons') as ModelInstance<PreprintProvider>;
    const brand = server.create('brand', {
        primaryColor: '#821e1e',
        secondaryColor: '#94918e',
        heroBackgroundImage: 'https://singlecolorimage.com/get/94918e/1000x1000',
    });
    const currentUserModerator = server.create('moderator',
        { id: currentUser.id, user: currentUser, provider: thesisCommons }, 'asAdmin');

    const preprints = server.createList('preprint', 3, {
        provider: thesisCommons,
    });
    thesisCommons.update({
        brand,
        moderators: [currentUserModerator],
        preprints,
        description: '<p style="color: red">This is the description for Thesis Commons and it has an inline-style!</p>',
    });

    const agrixiv = server.schema.preprintProviders.find('agrixiv') as ModelInstance<PreprintProvider>;
    const agrixivBrand = server.create('brand', {
        primaryColor: '#85BF9B',
        secondaryColor: '#E7F7E1',
        heroBackgroundImage: 'https://singlecolorimage.com/get/E7F7E1/1000x1000',
    });
    agrixiv.update({
        brand: agrixivBrand,
        description: '<p style="color: black">This is the description for agrixiv!</p>',
    });

    const nutrixiv = server.schema.preprintProviders.find('nutrixiv') as ModelInstance<PreprintProvider>;
    const nutrixivBrand = server.create('brand', {
        primaryColor: '#000000',
        secondaryColor: '#888888',
        heroBackgroundImage: 'https://singlecolorimage.com/get/4a4a4a/1000x1000',
    });
    nutrixiv.update({
        brand: nutrixivBrand,
        description: '<p style="color: green">This is the description for nutrixiv!</p>',
    });

    const biohackrxiv = server.schema.preprintProviders.find('biohackrxiv') as ModelInstance<PreprintProvider>;
    const biohackrxivBrand = server.create('brand', {
        primaryColor: '#000000',
        secondaryColor: '#ccc',
        heroBackgroundImage: 'https://singlecolorimage.com/get/ffffff/1000x1000',
    });
    biohackrxiv.update({
        brand: biohackrxivBrand,
        description: '<p style="color: black">This is the description for biohackrxiv!</p>',
    });
}
