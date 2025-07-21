export const formatHeight = (heightInches: number | null): string => {
    if (!heightInches) return "N/A";
    const feet = Math.floor(heightInches / 12);
    const inches = heightInches % 12;
    return `${feet}'${inches}`;
}

export const calculateAge = (birthDate: Date | null): number | null => {
    if (!birthDate) return null;
    const today = new Date();
    return Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  }
  
export const calculateExperience = (entryYear: number | null, lastSeason: number | null): string => {
    if (!entryYear) return "N/A";
    const currentYear = lastSeason ? lastSeason : new Date().getFullYear();
    const experience = currentYear - entryYear + 1;
    return experience === 1 ? "R" : experience.toString();
  }
  
export const formatDraftInfo = (entryYear: number | null, draftRound: number | null, draftNumber: number | null): string => {
    if (!draftRound) return "UDFA";
    return `${entryYear}, Rd. ${draftRound}-${draftNumber}`;
}