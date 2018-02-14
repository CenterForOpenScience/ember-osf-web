import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('node-link', {
    default: {
        targetNode: FactoryGuy.belongsTo('node'),
    },
});
