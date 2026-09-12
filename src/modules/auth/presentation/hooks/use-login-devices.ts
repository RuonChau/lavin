import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../infrastructure/services/auth.service';

export const useLoginDevices = () => {
  const queryClient = useQueryClient();

  const devicesQuery = useQuery({
    queryKey: ['auth', 'devices'],
    queryFn: () => authService.getLoginDevices(),
  });

  const revokeMutation = useMutation({
    mutationFn: (sessionId: string) => authService.revokeLoginDevice(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'devices'] });
    },
  });

  return {
    devices: devicesQuery.data ?? [],
    isLoadingDevices: devicesQuery.isLoading,
    isErrorDevices: devicesQuery.isError,
    refreshDevices: devicesQuery.refetch,
    revokeDevice: revokeMutation.mutateAsync,
    isRevokingDevice: revokeMutation.isPending,
    revokingDeviceId: revokeMutation.variables,
  };
};
