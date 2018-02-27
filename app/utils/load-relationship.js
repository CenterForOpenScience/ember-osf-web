import Ember from 'ember';

export const ArrayPromiseProxy = Ember.ArrayProxy.extend(Ember.PromiseProxyMixin);

export default function loadAll(model, relationship, dest, options = {}) {
    const page = options.page || 1;
    let query = {
        'page[size]': 10,
        page,
    };
    query = Ember.merge(query, options || {});
    Ember.set(model, 'query-params', query);

    return model.queryHasMany(relationship, query).then((results) => {
        dest.pushObjects(results.toArray());
        if (results.meta) {
            const { total } = results.meta;
            const pageSize = results.meta.per_page;
            const remaining = total - (page * pageSize);
            if (remaining > 0) {
                query.page = page + 1;
                query['page[size]'] = pageSize;
                return loadAll(model, relationship, dest, query);
            }
        }
    });
}

export function loadRelation(model, relationship) {
    let model_ = null;
    if (Object.prototype.hasOwnProperty.call(model, 'content') && !model_.query) {
        // model was loaded via a relationship, the proxy object
        // does not properly proxy .query so we unwrap it here
        model_ = model.get('content');
    }

    if (!model_) return new Ember.RSVP.Promise(() => null);

    const results = Ember.A();
    const promise = loadAll(model_, relationship, results).then(() => results);
    return ArrayPromiseProxy.create({ promise });
}
