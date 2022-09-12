import { RecordStatus } from '../../discrete-layer/models';

const STATUS = 'productStatus';
const UNPUBLISHED_COLOR = 'var(--mdc-theme-gc-warning-high)';

export const isUnpublished = (data: Record<string, unknown>): { color: string } | undefined => {
  return STATUS in data && Object.values(data).includes(RecordStatus.UNPUBLISHED) ? { color: UNPUBLISHED_COLOR } : undefined;
};