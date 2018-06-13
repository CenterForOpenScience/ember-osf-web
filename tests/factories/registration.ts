import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('registration', {
    default: {
        dateRegistered: () => faker.date.past(1),
        pendingRegistrationApproval: false,

        embargoEndDate: () => faker.date.future(1),
        pendingEmbargoApproval: false,

        withdrawn: false,
        pendingWithdrawal: false,

        // TODO: Implement with sample data for faker, possibly traits for different reg types
        registrationSupplement: null,
        registeredMeta: null,

        registeredFrom: () => FactoryGuy.belongsTo('node'),
        registeredBy: () => FactoryGuy.belongsTo('user'),

        contributors: () => FactoryGuy.hasMany('contributor', 3),
    },
    traits: {
        hasComments: {
            comments: () => FactoryGuy.hasMany('comment', 3),
        },
    },
});
