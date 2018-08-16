/* eslint-disable import/prefer-default-export,space-infix-ops */

declare module 'ember-data' {
    export type RelationshipsFor<Model> = keyof Model;
    namespace DS {
        interface JSONAPIAdapter {
            buildQuery(snapshot: DS.Snapshot): object;
        }
    }
}

/* eslint-enable import/prefer-default-export,space-infix-ops */
