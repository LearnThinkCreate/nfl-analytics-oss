interface BuildQueryStringOptions {
    skipKeys?: string[];
    jsonKeys?: string[];
    arrayKeys?: { key: string; separator?: string }[]; // e.g., { key: 'positions', separator: ',' }
    booleanKeys?: string[];
  }
  
  export function buildQueryString(
    params: Record<string, any>,
    options: BuildQueryStringOptions = {}
  ): string {
    const searchParams = new URLSearchParams();
    const { skipKeys = [], jsonKeys = [], arrayKeys = [], booleanKeys = [] } = options;
  
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key) && !skipKeys.includes(key)) {
        const value = params[key];
  
        if (value !== undefined && value !== null && value !== '') { // Added empty string check
          const arrayKeyConfig = arrayKeys.find(ak => ak.key === key);
  
          if (jsonKeys.includes(key) && typeof value === 'object') {
             if (Object.keys(value).length > 0) { // Avoid empty JSON objects
               searchParams.append(key, JSON.stringify(value));
             }
          } else if (arrayKeyConfig && Array.isArray(value) && value.length > 0) {
             searchParams.append(key, value.join(arrayKeyConfig.separator || ','));
          } else if (booleanKeys.includes(key)) {
             searchParams.append(key, String(!!value)); // Ensure true/false string
          } else {
             searchParams.append(key, String(value));
          }
        }
      }
    }
    return searchParams.toString();
  }



/**
 * Default SWR configuration
 * Provides reasonable defaults for all SWR hooks
 */
export const getDefaultOptions = (key: string | null) => {
  return {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    // revalidateIfStale: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    revalidateOnMount: key ? true : false,
    keepPreviousData: false,
  };
}; 