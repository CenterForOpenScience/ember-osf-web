import ArrayProxy from '@ember/array/proxy';
import { set } from '@ember/object';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';

export const ArrayPromiseProxy = ArrayProxy.extend(PromiseProxyMixin);

export default function loadAll(model, relationship, dest, options: any = {}) {
    const page = options.page || 1;
    const query = {
        ...options,
        'page[size]': 10,
        page,
    };
    set(model, 'query-params', query);

    return model.queryHasMany(relationship, query).then(results => {
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
