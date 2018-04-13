import { A } from '@ember/array';

interface QueryOptions {
    'page[size]'?: number;
    page?: number;
}

export default async function loadAll(
    model,
    relationship,
    query: QueryOptions = { 'page[size]': 10, page: 1 },
    results = A([]),
) {
    const currentResults = await model.queryHasMany(relationship, query);
    results.pushObjects(currentResults.toArray());

    const { meta: { total } } = currentResults;

    if (results.length < total) {
        return loadAll(model, relationship, { ...query, page: (query.page || 0) + 1 }, results);
    }

    return results;
}
