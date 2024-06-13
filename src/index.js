const emptyDoughnut = {
    id: 'emptyDoughnut',
    afterDraw(chart, args, options) {

        /** @type {Array<{data: any[]}>} datasets */
        const datasets = chart.data.datasets || [];

        /** @type {string} color */
        const color = options.color || 'rgba(110,110,110,0.5)';
        const radiusDecrease = options.radiusDecrease || 0;

        const cutout = pureNumber(options.cutout || chart.config?.options?.cutout || '50%');
        const hasData = datasets.every((v) => v.data.length > 0)

        if (hasData) return;

        const {chartArea: {left, top, right, bottom}, ctx} = chart;
        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;
        const r = (Math.min(right - left, bottom - top)) / 2;

        /** define default doughnut values   */
        const doughnut = {radius: r / 2, width: r};


        switch (typeof cutout) {
            /**
             * si la valeur est un nombre alors, on utilise la valeur comme pixel
             */
            case "number":

                doughnut.radius = (r + cutout - radiusDecrease) / 2;
                doughnut.width = r - cutout - radiusDecrease;
                break;

            /**
             * si la valeur est une chaine de caractère alors, on utilise la valeur comme pourcentage
             */
            case "string":
                const cutoutValue = parseInt(cutout, 10);
                if (isNaN(cutoutValue)) return;

                const ratio = cutoutValue / 100;
                const multiplier = Math.abs(ratio - 1);

                const radius = r / 2;

                doughnut.radius = (radius + (r - radius) * ratio) - radiusDecrease / 2;
                doughnut.width = (r * multiplier) - radiusDecrease;

                break;

            default:
                return;
        }

        if (doughnut.width <= 0) return;

        ctx.beginPath();

        ctx.lineWidth = doughnut.width;
        ctx.strokeStyle = color;
        ctx.arc(centerX, centerY, doughnut.radius, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.closePath();
    }
};

/**
 * This function convert a string to number if the string is a pure number else return the string
 *
 * @param {string|number} value
 * @param value
 * @returns {string|number}
 */
function pureNumber(value) {
    const number = Number(value)
    return isNaN(number) ? value : number;
}
export default emptyDoughnut;
