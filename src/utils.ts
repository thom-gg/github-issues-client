export const formatDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
});

export function getDateString(creationDate: Date, updateDate: Date) {
    let timestamp_post = creationDate.getTime();
    let timestamp_update = updateDate.getTime();
    if (timestamp_update > timestamp_post) {
        return "posted on " + formatDate.format(updateDate);
    }
    return "updated on " + formatDate.format(creationDate);
}