import { QueryOptions } from "./helper";

/**
 * Core data model for Hook.
 *
 * @public
 */
export type Hook = {
  id: string;
  moduleId: string;
  interface: string;
  registeredAt: string; // ISO 8601
  txHash: string;
};

/**
 * todo wait doc update
 * Request type for hook.register method.
 *
 * @public
 */
export type RegisterHookRequest = {};

/**
 * todo wait doc update
 * Response type for hook.register method.
 *
 * @public
 */
export type RegisterHookResponse = {};

/**
 * Request type for hook.get method.
 *
 * @public
 */
export type GetHookRequest = {
  hookId: string;
};

/**
 * Response type for hook.get method.
 *
 * @public
 */
export type GetHookResponse = {
  hook: Hook;
};

/**
 * Request type for hook.list method.
 *
 * @public
 */
export type ListHookRequest = {
  moduleId?: string;
  options?: QueryOptions;
};

/**
 * Response type for hook.list method.
 *
 * @public
 */
export type ListHookResponse = {
  hooks: Hook[];
};
