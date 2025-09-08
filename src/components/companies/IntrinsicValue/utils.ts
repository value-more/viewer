const buildUrl = (svgElement: SVGElement) => {
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], {
        type: 'image/svg+xml;charset=utf-8'
    });
    return URL.createObjectURL(svgBlob);
};

export const downloadSvg = (
    svgElement: SVGElement | null,
    filename: string
) => {
    if (!svgElement) return;

    const url = buildUrl(svgElement);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename; //`${ticker}.intrinsicValue-level${level}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
};

export const downloadSvgAsPng = (
    svgElement: SVGElement | null,
    filename: string
) => {
    if (!svgElement) return;

    const url = buildUrl(svgElement);

    const img = new Image();
    img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = svgElement.clientWidth;
        canvas.height = svgElement.clientHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
            if (!blob) return;
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }, 'image/png');
    };
    img.src = url;
};
