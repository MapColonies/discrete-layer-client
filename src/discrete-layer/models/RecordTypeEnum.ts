/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from "mobx-state-tree"

/**
 * Typescript enum
 */

export enum RecordType {
  RECORD_RASTER="RECORD_RASTER",
RECORD_3D="RECORD_3D",
RECORD_DEM="RECORD_DEM",
RECORD_ALL="RECORD_ALL"
}

/**
* RecordType
*/
export const RecordTypeEnumType = types.enumeration("RecordType", [
        "RECORD_RASTER",
  "RECORD_3D",
  "RECORD_DEM",
  "RECORD_ALL",
      ])
