export default (minutes: number): number => {
    const minutesInDay = 24 * 60; // Nombre de minutes dans une journée (24 heures * 60 minutes)
    const days = Math.floor(minutes / minutesInDay); // Nombre de jours complets
    return days;
};
