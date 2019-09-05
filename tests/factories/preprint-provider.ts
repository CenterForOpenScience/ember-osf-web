import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('preprint-provider', {
    default: {
        name: () => faker.lorem.words(1),
        logoPath: () => `/static/img/preprint_providers/${faker.lorem.words(1)}.png`,
        bannerPath: () => `/static/img/preprint_providers/${faker.lorem.words(1)}.png`,
        description: () => faker.lorem.words(3),
        advisoryBoard: () => faker.lorem.paragraphs(2),
        emailContact: 'contact+fake@osf.io',
        emailSupport: 'support+fake@osf.io',
        headerText: () => faker.lorem.words(3),
        subjects: FactoryGuy.hasMany('subject', 20),
    },
    traits: {
        isOSF: {
            id: 'osf',
        },
        hasPreprints: {
            preprints: FactoryGuy.hasMany('preprint', 5),
        },
        hasLicenses: {
            licensesAcceptable: FactoryGuy.hasMany('license', 3),
        },
    },
});
