import { HandlerContext, Schema, Request } from 'ember-cli-mirage';
import { process } from './utils'
import Taxonomy from 'ember-osf-web/models/taxonomy'

export function getProviderTaxonomies(this: HandlerContext, schema: Schema, request: Request) {
    const taxonomies = schema.taxonomies.all<Taxonomy>().models;
    const parentTaxonomyId = request.queryParams['filter[parents]'];
    let matchingTaxonomies;
    if (parentTaxonomyId === 'null') {
        matchingTaxonomies = taxonomies.filter( item => item.parent === null);
    } else {
        matchingTaxonomies = taxonomies.filter( item => {
            if (item.parent) {
                return item.parent.id === parentTaxonomyId
            } else {
                return false;
            }
        });
    }
    const json = process(schema, request, this, matchingTaxonomies.map(m => this.serialize(m).data))
    return json;
}
