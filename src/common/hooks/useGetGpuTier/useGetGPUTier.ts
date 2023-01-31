import { getGPUTier, ModelEntry, TierResult } from 'detect-gpu';
import { useEffect, useState } from 'react';

const useGetGPUTier = (): TierResult | null => {
  const [gpuTier, setGpuTier] = useState<TierResult>();

  useEffect(() => {
    void getGPUTier({
      override: {
        loadBenchmarks: async (file: string): Promise<ModelEntry[]> =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (await import(`./benchmarks/${file}`)).default as ModelEntry[],
      },
    }).then(setGpuTier);
  }, []);

  if (gpuTier) return gpuTier;

  return null;
};

export default useGetGPUTier;
