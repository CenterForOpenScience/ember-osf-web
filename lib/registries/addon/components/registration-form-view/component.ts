/* eslint-disable no-useless-constructor, no-empty-function */
import { layout, tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';

import {
    Page,
    Question as RegQuestion,
    RegistrationMetadata,
    Schema,
    Subquestion as RegSubquestion,
} from 'ember-osf-web/models/registration-schema';
import fixSpecialChar from 'ember-osf-web/utils/fix-special-char';
import slugify from 'ember-osf-web/utils/slugify';
import template from './template';

function fixAnswerValue<T>(value: T) {
    if (typeof value === 'string') {
        return fixSpecialChar(value);
    }
    if (Array.isArray(value)) {
        return value.map(v => fixSpecialChar(v));
    }
    return value;
}

export class Answerable {
    static componentMap: { [key: string]: string } = {
        'string-text': 'registration-form-view/x-text',
        'string-textarea': 'registration-form-view/x-text',
        'string-textarea-lg': 'registration-form-view/x-text',
        'string-textarea-xl': 'registration-form-view/x-text',
        'undefined-textarea': 'registration-form-view/x-text',
        'undefined-textarea-lg': 'registration-form-view/x-text',
        'undefined-textarea-xl': 'registration-form-view/x-text',
        'choose-singleselect': 'registration-form-view/x-options',
        'choose-multiselect': 'registration-form-view/x-options',
        'multiselect-undefined': 'registration-form-view/x-options',
        'osf-upload-osf-upload-toggle': 'registration-form-view/x-file',
        'osf-upload-osf-upload-open': 'registration-form-view/x-file',
        'osf-author-import-textarea': 'registration-form-view/x-text',
    };

    static parse(question: RegSubquestion, answers: RegistrationMetadata): Answerable {
        const answer = answers[question.id];
        return new Answerable(
            question.type,
            question.format,
            answer ? fixAnswerValue(answer.value as string | string[]) : '',
            Boolean(question.required),
            (answer && answer.extra && answer.extra.length) ? answer.extra : {},
            question.description,
        );
    }

    get componentName(): string {
        const key = `${this.type}-${this.format}`;
        if (!Answerable.componentMap[key]) {
            throw new Error(`Unrenderable type "${key}"`);
        }
        return Answerable.componentMap[key];
    }

    constructor(
        public readonly type: string,
        public readonly format: string,
        public readonly value: string | string[],
        public readonly isRequired: boolean,
        public readonly extra: any,
        public readonly description?: string,
    ) { }
}

export class Question {
    static parse(question: RegQuestion | RegSubquestion, answers: RegistrationMetadata): Question {
        let ans: RegistrationMetadata;
        let props: RegSubquestion[];
        const id = 'qid' in question ? question.qid : question.id;

        if (question.properties) {
            ans = answers[id].value as RegistrationMetadata;
            props = question.properties;
        } else {
            ans = answers;
            props = [{ ...question, id }];
        }

        return new Question(
            'title' in question ? question.title : question.description!,
            question.description || '',
            props.map(prop => Answerable.parse(prop, ans)),
        );
    }

    readonly slug: string;
    readonly isQuestion = true;

    constructor(
        public readonly title: string,
        public readonly description: string,
        public readonly answerables: Answerable[],
    ) {
        this.slug = slugify(title);
    }
}

export class Section {
    static parse(section: Page | RegQuestion, answers: RegistrationMetadata): Section {
        let sectionParts: Array<RegQuestion | RegSubquestion> | undefined;
        let sectionId: string;
        let isSubsection: boolean;
        if ('questions' in section) {
            sectionParts = section.questions;
            sectionId = section.id;
            isSubsection = false;
        } else {
            sectionParts = section.properties;
            sectionId = section.qid;
            isSubsection = true;
        }
        if (!sectionParts) {
            throw new Error('This question looks like a section but is not');
        }
        return new Section(
            section.title,
            sectionParts.map(question => {
                if (question.properties && question.properties.every(prop => Boolean(prop.properties))) {
                    return Section.parse(question as RegQuestion, answers);
                }
                const qAnswers = sectionId in answers ? answers[sectionId].value : answers;
                return Question.parse(question, qAnswers as RegistrationMetadata);
            }),
            isSubsection,
        );
    }

    readonly slug: string;
    readonly isSection = true;

    constructor(
        public readonly title: string,
        public readonly sectionParts: Array<Question | Section>,
        public readonly isSubsection = false,
    ) {
        this.slug = slugify(this.title);
    }
}

export class RegistrationForm {
    static parse(schema: Schema, answers: RegistrationMetadata): RegistrationForm {
        return new RegistrationForm(
            schema.title,
            schema.pages.map(page => Section.parse(page, answers)),
        );
    }

    public readonly title: string;
    public readonly sections: Section[];

    constructor(title: string, sections: Section[]) {
        this.title = title;
        this.sections = sections;
    }
}

/* eslint-enable no-useless-constructor, no-empty-function */
@tagName('')
@layout(template)
export default class RegistrationFormView extends Component {
    schema!: Schema;
    answers!: RegistrationMetadata;

    @computed('schema', 'answers')
    get form(): RegistrationForm {
        return RegistrationForm.parse(this.schema, this.answers);
    }

    @computed('form')
    get anchors() {
        return this.form.sections.map((section: Section) => ({
            title: section.title,
            slug: section.slug,
            sectionParts: section.sectionParts.map(p => ({
                title: p.title,
                slug: `${section.slug}.${p.slug}`,
            })),
        }));
    }
}
