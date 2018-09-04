/* eslint-disable space-infix-ops */

declare module 'ember-data' {
    export type RelationshipsFor<Model, T extends keyof Model = keyof Model> = T extends string ? T : never;
    namespace DS {
        interface JSONAPIAdapter {
            buildQuery(snapshot: DS.Snapshot): object;
        }
    }
}

/* eslint-enable space-infix-ops */
