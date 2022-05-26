/* This is a mst-gql generated file, don't modify it manually */
/* eslint-disable */
/* tslint:disable */
import { types } from "mobx-state-tree"

/**
 * Typescript enum
 */

export enum FractionType {
  MAJOR="MAJOR",
MINOR="MINOR",
PATCH="PATCH",
DAYS="DAYS",
MONTHS="MONTHS",
YEARS="YEARS"
}

/**
* FractionType
*/
export const FractionTypeEnumType = types.enumeration("FractionType", [
        "MAJOR",
  "MINOR",
  "PATCH",
  "DAYS",
  "MONTHS",
  "YEARS",
      ])
