import { IOptions } from "@map-colonies/react-core";
import { get } from 'lodash';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class GridThemes {
  // lightTheme: {
  // },
  // darkTheme: {
  //   "--ag-header-background-color": 'green',
  // },
  public static getTheme(mainTheme: IOptions): IOptions {
    const alternativeSurfaceColor = get(mainTheme, 'custom.GC_ALTERNATIVE_SURFACE', mainTheme.surface) as string;
    return {
      "--ag-header-background-color": alternativeSurfaceColor,
      "--ag-border-color": alternativeSurfaceColor,
      "--ag-background-color": alternativeSurfaceColor,
      "--ag-row-border-color": alternativeSurfaceColor,
      "--ag-secondary-border-color": alternativeSurfaceColor,
      "--ag-odd-row-background-color": alternativeSurfaceColor,
    };
  }
};