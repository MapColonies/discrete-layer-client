import { RecordStatus } from '../../discrete-layer/models';

const STATUS = 'productStatus';
const UNPUBLISHED_COLOR = 'var(--mdc-theme-gc-warning-high)';

export const existStatus = (data: Record<string, unknown>): boolean => {
  return STATUS in data;
};

export const isUnpublished = (data: Record<string, unknown>): boolean => {
  return Object.keys(data).includes(STATUS) && Object.values(data).includes(RecordStatus.UNPUBLISHED);
};

export const getStatusColoredText = (data: Record<string, unknown>): Record<string, unknown> | undefined => {
  return existStatus(data) && isUnpublished(data) ? { color: UNPUBLISHED_COLOR } : undefined;
};

export const getStatusColoredBackground = (data: Record<string, unknown>): Record<string, unknown> | undefined => {
  return existStatus(data) && isUnpublished(data) ? { backgroundColor: UNPUBLISHED_COLOR } : undefined;
};