export const MIN = -2;
export const MAX = 2;

export const chartOptions = {
    plugins: {
        legend: {
            display: false
        }
    },
    elements: {
        line: {
            borderWidth: 3
        }
    },
    scale: {
        min: MIN,
        max: MAX
    },
    scales: {
        r: {
            ticks: {
                display: false // Hides the labels in the middle (numbers)
            },
            grid: {
                color: '#BBB'
            }
        }
    }
};
