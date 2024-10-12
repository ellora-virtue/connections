import { Context, useContext } from 'react';

export const useRequiredContext = <T>(context: Context<T | null>): T => {
  const value = useContext(context);

  if (value == null) throw new Error('Context is required');

  return value;
};
