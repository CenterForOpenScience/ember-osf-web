import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('draft-registration', {
    default: {
        registrationSupplement: () => faker.lorem.words(1),
        datetimeInitiated: () => faker.date.past(1),
        datetimeUpdated: () => faker.date.recent(),
        branchedFrom: FactoryGuy.belongsTo('node'),
        initiator: FactoryGuy.belongsTo('user'),
        registrationSchema: FactoryGuy.belongsTo('metaschema'),
    },
});
