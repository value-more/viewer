const separators: { [key: string]: { group?: string; decimals?: string } } = {};
const getSeparators = (locale: string) => {
    if (!separators[locale]) {
        const parts = new Intl.NumberFormat(locale).formatToParts(1000.1);
        separators[locale] = {
            group: parts.find((part) => part.type === 'group')?.value,
            decimals: parts.find((part) => part.type === 'decimal')?.value
        };
    }
    return separators[locale];
};

export const parseNumber = (numberString: string, locale?: string): number => {
    const loc = locale || navigator.language;
    const separators = getSeparators(loc);

    if (separators?.group) {
        numberString = numberString.replaceAll(
            new RegExp(`\\${separators.group}`, 'g'),
            ''
        );
    }

    if (separators?.decimals) {
        numberString = numberString.replace(separators.decimals, '.');
    }

    return parseFloat(numberString);
};
