import { HandlerContext, ModelInstance, Request, Schema } from 'ember-cli-mirage';
import Subject from 'ember-osf-web/models/subject';
import { process } from './utils';

export function getFilterOpts(
    queryParams: { [key: string]: string },
): { type: string, value: string } {
    if ('filter[parent]' in queryParams) {
        const { 'filter[parent]': value } = queryParams;
        return { type: 'parent', value };
    }
    const { 'filter[text]': text } = queryParams;
    return { type: 'text', value: text };
}

export function getProviderSubjects(this: HandlerContext, schema: Schema, request: Request) {
    const { parentID: providerId } = request.params;
    const { pageSize } = request.queryParams;
    const filterOpts = getFilterOpts(request.queryParams);

    const provider = schema.registrationProviders.find(providerId);
    const subjects = provider.subjects.models;
    let filteredSubjects: Array<ModelInstance<Subject>>;

    if (filterOpts.type === 'parent') {
        if (filterOpts.value === 'null') {
            filteredSubjects = subjects.filter(
                (subject: ModelInstance<Subject>) => !subject.parent,
            );
        } else {
            filteredSubjects = subjects.filter(
                (subject: ModelInstance<Subject>) => subject.parent && (subject.parent.id === filterOpts.value),
            );
        }
    } else {
        filteredSubjects = subjects.filter(
            (subject: ModelInstance<Subject>) => subject.text.includes(filterOpts.value),
        );
    }

    return process(
        schema,
        request,
        this,
        filteredSubjects.map(subject => this.serialize(subject).data),
        { defaultPageSize: Number(pageSize) },
    );
}
