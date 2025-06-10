import '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient  } from '@tanstack/react-query';
import {
  postVisit,
  getCurrentMonthVisits,
} from '../api/visitAnalyticsAPI.ts'
import { VisitResponse } from '../types/visitAnalytics';
import { CurrMonthData } from '../types/visitAnalytics';


const defaultCurrMonthData: CurrMonthData = {total: 0, growth: 0};

export const useVisitAnalytics = () => {
  const queryClient = useQueryClient();

  const currMonthVisitQuery = useQuery({
    queryKey: ['getCurrentMonthVisits'],
    queryFn: getCurrentMonthVisits,
    staleTime: 1000 * 60 * 60 * 24 * 30, 
    refetchInterval: false
  });

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

  const isVisitLoading = currMonthVisitQuery.isLoading;

  const isVisitError = currMonthVisitQuery.isError;

  return {
    currMonthVisits: currMonthVisitQuery.data ?? defaultCurrMonthData,
    handleVisit,
    isVisitLoading,
    isVisitError,
  };
};