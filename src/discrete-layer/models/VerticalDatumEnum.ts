/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from "mobx-state-tree"

/**
 * Typescript enum
 */

export enum VerticalDatum {
  WGS_1984="WGS_1984",
WGS_1972="WGS_1972",
PULKOVO_1942="PULKOVO_1942",
PALESTINE_1923="PALESTINE_1923",
MSL_HEIGHT="MSL_HEIGHT",
ISRAEL="ISRAEL",
ED_1950_IDF="ED_1950_IDF"
}

/**
* VerticalDatum
*/
export const VerticalDatumEnumType = types.enumeration("VerticalDatum", [
        "WGS_1984",
  "WGS_1972",
  "PULKOVO_1942",
  "PALESTINE_1923",
  "MSL_HEIGHT",
  "ISRAEL",
  "ED_1950_IDF",
      ])
