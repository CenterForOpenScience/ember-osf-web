import { HandlerContext, ModelInstance, Request, Response, Schema } from 'ember-cli-mirage';
import { MirageNode } from '../factories/node';
import { MirageRegistration } from '../factories/registration';

function getParentNode(schema: Schema, request: Request) {
    const nodeType = request.url.split('/')[4];
    const { parentID } = request.params;
    if (nodeType === 'registrations') {
        return schema.registrations.find(parentID) as ModelInstance<MirageRegistration>;
    }
    return schema.nodes.find(parentID) as ModelInstance<MirageNode>;
}

export function institutionAdd(this: HandlerContext, schema: Schema) {
    const { data: [{ id: institutionId }] } = JSON.parse(this.request.requestBody);
    const institutionIds: Array<number|string> = getParentNode(schema, this.request).affiliatedInstitutionIds;

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

export function institutionDelete(this: HandlerContext, schema: Schema) {
    const { data: [{ id }] } = JSON.parse(this.request.requestBody);
    const institutionIds: Array<number|string> = getParentNode(schema, this.request).affiliatedInstitutionIds;

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

export function institutionUpdate(this: HandlerContext, schema: Schema) {
    const { institutionID } = this.request.params;
    const attrs = this.normalizedRequestAttrs('institution');
    const updatedInfo = schema.affiliatedInstitutions.find(institutionID).update(attrs);

    return updatedInfo;
}
