import { HandlerContext, Request, Response, Schema } from 'ember-cli-mirage';
import { pluralize } from 'ember-inflector';

export function getCitation(this: HandlerContext, schema: Schema, request: Request) {
    const { guid: guidID, citationStyleID } = request.params;
    const guid = schema.guids.find(guidID);

    if (!guid) {
        return new Response(404, {}, {
            meta: { version: '2.9' },
            errors: [{ detail: 'Not found.' }],
        });
    }

    const citable = schema[pluralize(guid.referentType!)].find(guidID);
    const citationStyle = schema.citationStyles.find(citationStyleID);

    return new Response(200, {}, {
        data: {
            id: citationStyleID,
            type: 'citations',
            attributes: {
                citation: `Pretend citation for "${citable.title}" in the style "${citationStyle.title}"`,
            },
        },
        meta: { version: '2.9' },
    });
}
