// Public API - Types
export type { JsonValue, JsonObject, JsonArray } from "./contract/type/JsonTypes";
export { Result } from "./contract/type/Result";
export * from "./contract/type/DiffService";

// Public API - Constants
export {
  TYPE_ADD,
  TYPE_DELETE,
  TYPE_MODIFY,
} from "./contract/constant";

// Public API - Factory
export { createDiffService } from "./service";

// Advanced API - for custom injector configuration
export { createDiffInjector, Injector } from "./service";
