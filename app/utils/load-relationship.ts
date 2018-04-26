import { A } from '@ember/array';
import OsfModel from 'ember-osf-web/models/osf-model';

interface QueryOptions {
    'page[size]'?: number;
    page?: number;
}

export default async function loadAll(
    model: OsfModel,
    relationship: keyof OsfModel | 'quickfiles',
    query: QueryOptions = { 'page[size]': 10, page: 1 },
    results: any[] = A([]),
): Promise<any[]> {
    const currentResults = await model.queryHasMany(relationship, query);
    results.pushObjects(currentResults.toArray());

    const { meta: { total } } = currentResults;

    if (results.length < total) {
        return loadAll(model, relationship, { ...query, page: (query.page || 0) + 1 }, results);
    }

    return results;
}
