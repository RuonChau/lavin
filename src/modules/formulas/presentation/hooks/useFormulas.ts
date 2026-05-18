import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formulaService } from '../../infrastructure/services/formula.service';
import { Formula } from '../../domain/entities/formula.entity';

export const useFormulas = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['formulas'],
    queryFn: () => formulaService.getFormulas(),
  });

  const updateFormulaMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Formula> }) => 
      formulaService.updateFormula(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formulas'] });
    },
  });

  const createFormulaMutation = useMutation({
    mutationFn: (data: Partial<Formula>) => formulaService.createFormula(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formulas'] });
    },
  });

  return {
    formulas: data || [],
    isLoading,
    refreshFormulas: refetch,
    updateFormula: updateFormulaMutation.mutateAsync,
    isUpdating: updateFormulaMutation.isPending,
    createFormula: createFormulaMutation.mutateAsync,
    isCreating: createFormulaMutation.isPending,
  };
};
