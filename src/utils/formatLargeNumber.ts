export const formatLargeNumber = (
    langage: string,
    number?: number,
    indexAbbreviation?: number
): string => {
    if (number === undefined || number === null) {
        return '';
    }

    const abbreviations = ['', 'K', 'M', 'B', 'T'];
    let log1000 =
        indexAbbreviation == undefined || indexAbbreviation === -1
            ? number !== 0
                ? Math.floor(Math.log10(Math.abs(number)) / 3)
                : 0
            : indexAbbreviation;

    const diff = log1000 - abbreviations.length;
    if (diff >= 0) {
        log1000 -= diff + 1;
    }

    const roundedNumber = (number / Math.pow(1000, log1000)).toLocaleString(
        langage,
        // disable digits when < kilo
        log1000 > 1
            ? {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
              }
            : undefined
    );

    return `${roundedNumber}${indexAbbreviation === -1 ? abbreviations[log1000] : ''}`;
};
