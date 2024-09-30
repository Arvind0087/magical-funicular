// Array
export function getPreviousYearsArr() {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let i = currentYear; i >= currentYear - 10; i--) {
        years.push(i);
    }

    return years;
}

//Array Of object
export function getPreviousYearsObj() {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let i = currentYear; i >= currentYear - 10; i--) {
        years.push({ value: i, label: i.toString() });
    }

    return years;
}