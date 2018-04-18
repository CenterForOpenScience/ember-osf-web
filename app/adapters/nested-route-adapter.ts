import { assert } from '@ember/debug';
import DS from 'ember-data';
import OsfAdapter from './osf-adapter';

/**
 * @module ember-osf-web
 * @submodule adapters
 */

/**
 * Base adapter class for models which are nested under another model type in the API.
 *
 * @class NestedRouteAdapter
 * @extends OsfAdapter
 */
export default class NestedRouteAdapter extends OsfAdapter {
    get parentRelationship() {
        return assert('NestedRouteAdapter subclasses must implement `parentRelationship`', false);
    }

    urlForFindRecord(id: string, modelName: string, snapshot: DS.Snapshot) {
        const url = snapshot.record.get('links.self');
        assert(`Nested object (id: ${id}, type: ${modelName}) must have self link`, url);
        return url;
    }

    urlForCreateRecord(modelName: string, snapshot: DS.Snapshot) {
        const parentObj = snapshot.record.belongsTo(this.parentRelationship).value();
        assert('To create a nested object, the parent must already be loaded.', parentObj);

        const { name: inverseRelation } = snapshot.record.inverseFor(this.parentRelationship);

        // @ts-ignore: Big list of nested properties
        const url = parentObj.get(`links.relationships.${inverseRelation}.links.related.href`);
        assert(`Couldn't find create link for nested ${modelName}`, url);
        return url;
    }

    urlForUpdateRecord(id: string, modelName: string, snapshot: DS.Snapshot) {
        const url = snapshot.record.get('links.self');
        assert(`Nested object (id: ${id}, type: ${modelName}) must have self link`, url);
        return url;
    }

    urlForDeleteRecord(id: string, modelName: string, snapshot: DS.Snapshot) {
        const links = snapshot.record.get('links');
        const url = links.delete || links.self;
        assert(`Nested object (id: ${id}, type: ${modelName}) must have self or delete link`, url);
        return url;
    }

    urlForQuery(query: any, modelName: string) {
        assert(
            `Model ${modelName} is nested under its '${this.parentRelationship}' relation. Do not use query.`,
            false,
        );
        return '';
    }

    urlForQueryRecord(query: any, modelName: string) {
        assert(
            `Model ${modelName} is nested under its '${this.parentRelationship}' relation. Do not use queryRecord.`,
            false,
        );
        return '';
    }
}
