import DS from 'ember-data';
import { default as EmberDataModel } from '@ember-data/model';

declare module 'ember-data' {
    export type ModelKeys<Model extends EmberDataModel> = Exclude<keyof Model, keyof EmberDataModel>;
    export type AttributesFor<Model extends EmberDataModel> = ModelKeys<Model>;
    export type RelationshipsFor<Model extends EmberDataModel> = ModelKeys<Model>;
    namespace DS {
        interface JSONAPIAdapter {
            buildQuery(snapshot: DS.Snapshot): object;
        }

        interface Adapter {
            urlPrefix(path?: string, parentURL?: string): string;
        }

        interface Model {
            reload(options?: {}): RSVP.Promise<this>;
        }
    }
}
