import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('user', {
    default: {
        fullName: () => faker.name.findName(),
        givenName: () => faker.name.firstName(),
        familyName: () => faker.name.lastName(),
        dateRegistered: () => faker.date.past(1),
    },
    traits: {
        // TODO: Consider writing tests that would force pagination of relationships (!)
        hasProjects: {
            nodes: () => FactoryGuy.hasMany('node', 3),
        },
        hasRegistrations: {
            registrations: () => FactoryGuy.hasMany('registration', 3),
        },
        hasInstitutions: {
            affiliatedInstitutions: () => FactoryGuy.hasMany('institution', 2),
        },
    },
});
