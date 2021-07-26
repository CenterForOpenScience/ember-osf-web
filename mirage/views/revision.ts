import { HandlerContext, NormalizedRequestAttrs, Request, Response, Schema } from 'ember-cli-mirage';
import RevisionModel from 'ember-osf-web/models/revision';

export function createNewRevision(this: HandlerContext, schema: Schema, request: Request) {
    const attrs = this.normalizedRequestAttrs('revision') as Partial<NormalizedRequestAttrs<RevisionModel>>;
    if (!attrs.registration) {
        return new Response(400, {}, {
            meta: { version: '2.9' },
            errors: [{ detail: 'YOU SHOULD GIMME A REGISTRATION!!!!!!!!!!!' }],
        });
    }
    
}