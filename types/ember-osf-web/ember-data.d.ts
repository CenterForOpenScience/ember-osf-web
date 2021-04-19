import Model from '@ember-data/model';
import DS from 'ember-data';

declare module 'ember-data' {
    export type ModelKeys<Model extends Model> = Exclude<keyof Model, keyof Model>;
    export type AttributesFor<Model extends Model> = ModelKeys<Model>;
    export type RelationshipsFor<Model extends Model> = ModelKeys<Model>;
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
