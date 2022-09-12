import { RecordStatus } from '../../discrete-layer/models';

const STATUS = 'productStatus';
const UNPUBLISHED_COLOR = 'var(--mdc-theme-gc-warning-high)';

export const isUnpublished = (data: Record<string, unknown>): boolean => {
  return STATUS in data && Object.values(data).includes(RecordStatus.UNPUBLISHED);
};

export const getStatusStyle = (data: Record<string, unknown>): { color: string } | undefined => {
  return isUnpublished(data) ? { color: UNPUBLISHED_COLOR } : undefined;
};