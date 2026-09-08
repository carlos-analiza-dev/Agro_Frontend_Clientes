import { useMemo } from "react";
import { generateNavItems } from "@/helpers/data/sidebar/sidebarData";
import useGetEspeciesByFincas from "./useGetEspeciesByFincas";

export const useNavItemsWithEspecies = () => {
  const { data: especiesData, isLoading, isError } = useGetEspeciesByFincas();

  const navItems = useMemo(() => {
    if (especiesData && especiesData.length > 0) {
      return generateNavItems(especiesData);
    }

    return generateNavItems([]);
  }, [especiesData]);

  return {
    navItems,
    isLoading,
    isError,
    especies: especiesData || [],
  };
};
