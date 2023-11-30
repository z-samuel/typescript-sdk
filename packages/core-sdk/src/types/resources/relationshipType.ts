import { QueryOptions, TxOptions } from "../options";
import { RelatedElements } from "./relationship";

export type RelationshipType = {
  type: string;
  ipOrgId: string;
  srcContract: string;
  srcRelatable: number;
  srcSubtypesMask: number;
  dstContract: string;
  dstRelatable: number;
  dstSubtypesMask: number;
  registeredAt: string;
  txHash: string;
};

export type GetRelationshipTypeRequest = {
  ipOrgId: string;
  relType: string;
};

export type GetRelationshipTypeResponse = {
  relationshipType: RelationshipType;
};

export type ListRelationshipTypesRequest = {
  ipOrgId?: string;
  options?: QueryOptions;
};

export type ListRelationshipTypesResponse = {
  relationshipTypes: RelationshipType[];
};

export type RegisterRelationshipTypeRequest = {
  ipOrgId: string;
  relType: string;
  relatedElements: RelatedElements;
  allowedSrcs: string[];
  allowedDsts: string[];
  preHooksConfig: Record<string, unknown>[];
  postHooksConfig: Record<string, unknown>[];
  txOptions?: TxOptions;
};

export type RegisterRelationshipTypeResponse = {
  txHash: string;
  success?: boolean;
  relationshipId?: string;
};
