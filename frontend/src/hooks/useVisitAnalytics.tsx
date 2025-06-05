import '@tanstack/react-query';
import { useMutation, useQueryClient  } from '@tanstack/react-query';
import {
  postVisit,
} from '../api/visitAnalyticsAPI.ts'
import { VisitResponse } from '../types/visitAnalytics';


export const useVisitAnalytics = () => {
  const queryClient = useQueryClient();

  const postMutation = useMutation<VisitResponse, Error, Date>({
    mutationFn: postVisit,
    onSuccess: () => {
      queryClient.invalidateQueries({
          predicate: query => query.queryKey[0] === 'products',
      });
      alert('Visit recorded successfully');
    },
    onError: (error) => {
      alert(error.message);
    },        
  });
  
  const handleVisit = (timestamp: Date) => {
    postMutation.mutate(timestamp);
  };

  return {    
    handleVisit
  };
};