declare module 'ember-data' {
    namespace DS {
        interface JSONAPIAdapter {
            buildQuery(snapshot: DS.Snapshot): object;
        }
    }
}
