import { HandlerContext, Request, Response, Schema } from 'ember-cli-mirage';

export function institutionAdd(this: HandlerContext, schema: Schema, request: Request) {
    const { parentID } = request.params;
    const node = schema.nodes.find(parentID);

    const institutionIds = node.affiliatedInstitutionIds;

    const institutionId = JSON.parse(this.request.requestBody).data[0].id;

    try {
        institutionIds.push(institutionId);
    } catch (e) {
        return new Response(409, {}, {
            meta: { version: '2.9' },
            errors: [{ detail: 'Conflict.' }],
        });
    }

    return institutionIds;
}

export function institutionDelete(this: HandlerContext, schema: Schema, request: Request) {
    const { id, parentID } = request.params;
    const node = schema.nodes.find(parentID);

    const institutionIds = node.affiliatedInstitutionIds;

    try {
        institutionIds.splice(institutionIds.indexOf(id), 1);
    } catch (e) {
        return new Response(409, {}, {
            meta: { version: '2.9' },
            errors: [{ detail: 'Conflict.' }],
        });
    }
    return institutionIds;
}

export function institutionUpdate(this: HandlerContext, schema: Schema, request: Request) {
    const { institutionID } = request.params;
    const attrs = this.normalizedRequestAttrs('affiliatedInstitutions');
    const updatedInfo = schema.affiliatedInstitutions.find(institutionID).update(attrs);

    return updatedInfo;
}
