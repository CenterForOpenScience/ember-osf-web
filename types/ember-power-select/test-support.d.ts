declare module 'ember-power-select/test-support' {
    export function selectChoose(cssPath: string, optionTextOrOptionSelector: string, index?: number);
    export function selectSearch(cssPath: string, searchText: string);
    export function removeMultipleOption(cssPath: string, optionText: string);
    export function clearSelected(cssPath: string, optionText: string);
}

declare module 'ember-power-select/test-support/helpers' {
    export function clickTrigger(scope?: string);
    export function typeInSearch(text: string);
    export function selectChoose(text: string);
}
