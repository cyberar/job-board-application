/**
 * Formats a date string into a readable date.
 *
 */
export const formatDate = (date: string): string => {
    const parsedDate = new Date(`${date}T00:00:00Z`);

    if (Number.isNaN(parsedDate.getTime())) {
        return 'Invalid date';
    }

    return new Intl.DateTimeFormat('en-NG', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(parsedDate);
};
