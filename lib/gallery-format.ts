export function formatDossierDate(dateStr: string, location: string) {
    const datePart = dateStr
        ? dateStr.replace(/-/g, ".") // "2026-04-12" -> "2026.04.12"
        : "DATE UNKNOWN";
    return location ? `${datePart} // ${location.toUpperCase()}` : datePart;
}