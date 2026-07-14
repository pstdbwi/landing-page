import { corporateProgram } from "@/services/corporate";
import { useQuery } from "@tanstack/react-query";

export interface ProgramOption {
  id: string;
  value: string;
  label: string;
  [key: string]: any;
}

export const useSumutPrograms = () => {
  return useQuery({
    queryKey: ["sumut-programs"],
    queryFn: async () => {
      const addresses = ["wakafsumutberkah.id", "program.wakafsumutberkah.id"];

      const results = await Promise.all(
        addresses.map((address) =>
          corporateProgram({ address, size: 100 }).catch((err) => {
            console.error(`Error fetching programs for ${address}:`, err);
            return [];
          }),
        ),
      );

      // Flatten and de-duplicate by ID
      const allFetchedPrograms = results.flat().filter(Boolean);
      const uniqueProgramsMap = new Map<string, any>();

      allFetchedPrograms.forEach((p) => {
        if (p.id && !uniqueProgramsMap.has(p.id)) {
          uniqueProgramsMap.set(p.id, p);
        }
      });

      const uniquePrograms = Array.from(uniqueProgramsMap.values());

      const programOptions: ProgramOption[] = [
        { id: "all", value: "all", label: "Semua Program" },
        ...uniquePrograms.map((p) => ({
          ...p,
          value: p.id,
          label: p.title || p.address || "Untitled Program",
        })),
      ];

      const allIds = uniquePrograms.map((p) => p.id).join(",");

      return { programOptions, allIds };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
