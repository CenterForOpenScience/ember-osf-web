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
import template from './template';

export class Answerable {
    static componentMap: { [key: string]: string } = {
        'string-text': 'x-text',
        'string-textarea': 'x-text',
        'choose-singleselect': 'x-text',
        'choose-multiselect': 'x-text',
        'osf-upload-osf-upload-toggle': 'x-file',
        'osf-upload-osf-upload-open': 'x-file',
        'osf-author-import-textarea': 'x-text',
    };

    static parse(question: RegSubquestion, answers: RegistrationMetadata): Answerable {
        const answer = answers[question.id];
        return new Answerable(
            question.type,
            question.format,
            answer.value as string,
            (answer.extra && answer.extra.length) ? answer.extra : {},
        );
    }

    get component(): string {
        const key = `${this.type}-${this.format}`;
        if (!Answerable.componentMap[key]) {
            throw new Error(`Unrenderable type "${key}"`);
        }
        return Answerable.componentMap[key];
    }

    constructor(
        public readonly type: string,
        public readonly format: string,
        public readonly value: string,
        public readonly extra: any,
    ) { }
}

export class Question {
    static parse(question: RegQuestion, answers: RegistrationMetadata): Question {
        let ans: RegistrationMetadata;
        let props: RegSubquestion[];
        if (question.properties) {
            ans = answers[question.qid].value as RegistrationMetadata;
            props = question.properties;
        } else {
            ans = answers;
            const x = { ...question, id: question.qid };
            delete x.qid;
            props = [x];
        }
        return new Question(
            question.nav,
            question.title,
            question.description || '',
            props.map(prop => Answerable.parse(prop, ans)),
        );
    }

    constructor(
        public readonly nav: string,
        public readonly title: string,
        public readonly description: string,
        public readonly parts: Answerable[],
    ) { }
}

export class Section {
    static parse(page: Page, answers: RegistrationMetadata): Section {
        return new Section(
            page.title,
            page.questions.map(question => Question.parse(question, answers)),
        );
    }

    public readonly title: string;
    public readonly questions: Question[];

    constructor(title: string, questions: Question[]) {
        this.title = title;
        this.questions = questions;
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
}
