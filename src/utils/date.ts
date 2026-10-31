// YYYY-MM-DD in the user's timezone (toISOString would give the UTC day)
export const getLocalDate = (date: Date = new Date()) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
};
