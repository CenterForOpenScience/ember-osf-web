import DS from 'ember-data';

declare module 'ember-data' {
    export type AttributesFor<Model, T extends keyof Model = keyof Model> = T extends string ? T : never;
    export type RelationshipsFor<Model, T extends keyof Model = keyof Model> = T extends string ? T : never;
    namespace DS {
        interface JSONAPIAdapter {
            buildQuery(snapshot: DS.Snapshot): object;
        }

        interface Model {
            reload(options?: {}): RSVP.Promise<this>;
        }
    }
    export default DS;
}
