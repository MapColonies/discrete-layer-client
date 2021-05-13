/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from "mobx-state-tree"

/**
 * Typescript enum
 */

export enum RecordType {
  RECORD_RASTER="RASTER",
  RECORD_3D="3D",
  RECORD_ALL="ALL"
}

/**
* RecordType
*/
export const RecordTypeEnumType = types.enumeration("RecordType", [
  "RASTER",
  "3D",
  "ALL",
])
