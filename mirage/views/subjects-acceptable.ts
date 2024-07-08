import { HandlerContext, ModelInstance, Request, Schema } from 'ember-cli-mirage';
import Subject from 'ember-osf-web/models/subject';
import { process } from './utils';
import { getFilterOpts } from './provider-subjects';

export function getSubjectsAcceptable(this: HandlerContext, schema: Schema, request: Request) {
    const { pageSize } = request.queryParams;
    const filterOpts = getFilterOpts(request.queryParams);

    const subjects = schema.subjects.all().models;
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
