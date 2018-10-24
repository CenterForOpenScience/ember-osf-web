import { HandlerContext, Request, Schema } from 'ember-cli-mirage';
import { filter, process } from './utils';

export function relationshipList(
    type: string,
    relationshipName: string,
    schema: Schema,
    request: Request,
    handlerContext: HandlerContext,
    defaultSortKey: string = '-id',
) {
    return process(
        schema,
        request,
        handlerContext,
        schema[type].find(request.params.id)[relationshipName].models.map(
            (model: any) => handlerContext.serialize(model).data,
        ),
        { defaultSortKey },
    );
}

export function modelList(
    type: string,
    schema: Schema,
    request: Request,
    handlerContext: HandlerContext,
    defaultSortKey: string = '-id',
) {
    const models = schema[type]
        .where(m => filter(m, request))
        .models
        .map((token: any) => handlerContext.serialize(token).data);

    return process(schema, request, handlerContext, models, { defaultSortKey });
}
