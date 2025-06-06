import '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient  } from '@tanstack/react-query';
import {
  getVisits,
  postVisit,
} from '../api/visitAnalyticsAPI.ts'
import { VisitResponse } from '../types/visitAnalytics';


export const useVisitAnalytics = () => {
  const queryClient = useQueryClient();

  const visitQuery = useQuery({
    queryKey: ['getVisits'],
    queryFn: getVisits,
    staleTime: 1000 * 60 * 60 * 24 * 30, 
    refetchInterval: false
  })

  const postMutation = useMutation<VisitResponse, Error, Date>({
    mutationFn: postVisit,
    onSuccess: () => {
      queryClient.invalidateQueries({
          predicate: query => query.queryKey[0] === 'products',
      });
      // alert('Visit recorded successfully');
    },
    onError: (error) => {
      alert(error.message);
    },        
  });
  
  const handleVisit = (timestamp: Date) => {
    postMutation.mutate(timestamp);
  };

  const isVisitLoading = visitQuery.isLoading;

  const isVisitError = visitQuery.isError;

  return {
    visits: visitQuery.data ?? 0,
    handleVisit,
    isVisitLoading,
    isVisitError,
  };
};