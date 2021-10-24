/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import vest, { test, enforce } from 'vest';
import { useIntl } from 'react-intl';
// import { IVestResult } from 'vest/vestResult';

const MIN_RESOLUTION = 0.00000009;
const MAX_RESOLUTION = 0.072;
const MIN_RESOLUTION_METER = 0.01;
const MAX_RESOLUTION_METER = 8000;

const suite = vest.create((data: any = {}): any => {
  const intl = useIntl();

  test('productName', intl.formatMessage({ id: 'validation-general.required' }), () => {
    enforce(data['productName'] as string).isNotEmpty();
  });

  test('creationDate', intl.formatMessage({ id: 'validation-general.required' }), () => {
    enforce(data['creationDate'] as Date).isNotEmpty();
  });

  test('sourceDateStart', intl.formatMessage({ id: 'validation-field.sourceDateStart.max' }), () => {
    enforce(data['sourceDateStart'] as Date).lessThan(data['sourceDateEnd']);
  });

  test('sourceDateEnd', intl.formatMessage({ id: 'validation-field.sourceDateEnd.min' }), () => {
    enforce(data['sourceDateEnd'] as Date).greaterThanOrEquals(data['sourceDateStart']);
  });

  test('sensorType', intl.formatMessage({ id: 'validation-general.required' }), () => {
    enforce(data['sensorType'] as string).isNotEmpty();
  });

  test('region', intl.formatMessage({ id: 'validation-general.required' }), () => {
    enforce(data['region'] as string).isNotEmpty();
  });

  test('productId', intl.formatMessage({ id: 'validation-general.required' }), () => {
    enforce(data['productId'] as string).isNotEmpty();
  });

  test('productVersion', intl.formatMessage({ id: 'validation-general.required' }), () => {
    enforce(data['productVersion'] as string).isNotEmpty();
  });

  test('productVersion', intl.formatMessage({ id: 'validation-field.productVersion.pattern' }), () => {
    enforce(data['productVersion'] as string).matches('^[1-9]\\d{0,2}(\\.(0|[1-9]\\d?))?$');
  });

  test('productType', intl.formatMessage({ id: 'validation-general.required' }), () => {
    enforce(data['productType'] as string).isNotEmpty();
  });

  test('resolution', intl.formatMessage({ id: 'validation-general.required' }), () => {
    enforce(data['resolution'] as number).isNotEmpty();
  });

  test('resolution', intl.formatMessage({ id: 'validation-field.resolution.min' }), () => {
    enforce(data['resolution'] as number).greaterThanOrEquals(MIN_RESOLUTION);
  });

  test('resolution', intl.formatMessage({ id: 'validation-field.resolution.max' }), () => {
    enforce(data['resolution'] as number).lessThan(MAX_RESOLUTION);
  });

  test('maxResolutionMeter', intl.formatMessage({ id: 'validation-general.required' }), () => {
    enforce(data['maxResolutionMeter'] as number).isNotEmpty();
  });

  test('maxResolutionMeter', intl.formatMessage({ id: 'validation-field.maxResolutionMeter.min' }), () => {
    enforce(data['maxResolutionMeter'] as number).greaterThanOrEquals(MIN_RESOLUTION_METER);
  });

  test('maxResolutionMeter', intl.formatMessage({ id: 'validation-field.maxResolutionMeter.max' }), () => {
    enforce(data['maxResolutionMeter'] as number).lessThan(MAX_RESOLUTION_METER);
  });

  test('scale', intl.formatMessage({ id: 'validation-field.scale.pattern' }), () => {
    enforce(data['scale'] as string).matches('^(0|[1-9]\\d{0,8})$');
  });

  test('footprint', intl.formatMessage({ id: 'validation-general.required' }), () => {
    enforce(data['footprint'] as string).isNotEmpty();
  });

});

// eslint-disable-next-line
export default suite;
