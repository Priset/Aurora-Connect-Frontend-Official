import { useCallback } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { UseFormSetError, FieldValues, Path } from 'react-hook-form';

interface ValidationError {
  field: string;
  message: string;
}

interface BackendErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
  details?: ValidationError[];
}

export const useFormValidation = () => {
  const handleBackendErrors = useCallback(
    <T extends FieldValues>(error: unknown, setError: UseFormSetError<T>) => {
      if (error instanceof AxiosError) {
        const errorData = error.response?.data as BackendErrorResponse;
        
        if (errorData?.details && Array.isArray(errorData.details)) {
          errorData.details.forEach((detail) => {
            setError(detail.field as Path<T>, {
              type: 'server',
              message: detail.message,
            });
          });
        } else if (errorData?.message) {
          toast.error(errorData.message);
        } else {
          toast.error('Ha ocurrido un error inesperado');
        }
      } else {
        toast.error('Ha ocurrido un error inesperado');
      }
    },
    []
  );

  const handleValidationError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const handleSuccess = useCallback((message: string) => {
    toast.success(message);
  }, []);

  return {
    handleBackendErrors,
    handleValidationError,
    handleSuccess,
  };
};
