export const displayMetricField = (language: string, field?: number) =>
    field !== undefined
        ? `${(field * 100).toLocaleString(language, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
          })}%`
        : '';
