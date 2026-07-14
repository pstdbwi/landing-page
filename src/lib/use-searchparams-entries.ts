import { useSearchParams } from 'next/navigation';

const useSearchParamsEntries = () => {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  return { ...params };
};

export default useSearchParamsEntries;
