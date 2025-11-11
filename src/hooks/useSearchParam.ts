import { parseAsString, useQueryState } from "nuqs";

export function useSearchparam() {
  return useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ clearOnDefault: true })
  );
}
