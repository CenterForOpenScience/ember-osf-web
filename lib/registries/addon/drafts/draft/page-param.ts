import slugify from 'ember-osf-web/utils/slugify';

export const DefaultPage = '1';

export function getPageIndex(pageParam: string): number | undefined {
    const match = pageParam.match(/^\d+(?=-)/);
    return match ? +match[0] : undefined;
}

export function getDefaultParam(): string {
    return DefaultPage;
}

export function getPageParam(
    pageIndex: number,
    pageHeading?: string,
): string {
    const slug = pageHeading ? slugify(pageHeading) : '';
    return slug ? `${pageIndex}-${slug}` : `${pageIndex}`;
}
