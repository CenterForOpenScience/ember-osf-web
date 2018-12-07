import { faker } from 'ember-cli-mirage';

export function randomGravatar() {
    return `https://www.gravatar.com/avatar/${faker.random.uuid().replace(/-/g, '')}?d=identicon`;
}
