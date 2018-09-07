import { process } from './utils';

export function relationshipList(type: string, relationshipName: string, schema: any, request: any, config: any) {
    return process(
        schema,
        request,
        config,
        schema[type].find(request.params.id)[relationshipName].models.map((model: any) => config.serialize(model).data),
        {},
    );
}
