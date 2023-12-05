import { QueryOptions, TxOptions } from "../options";
import { TypedData } from "../common";
import { Relatables } from "../../enums/Relatables";

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

export type RelatedElements = {
  src: Relatables;
  dst: Relatables;
};

export type RegisterRelationshipTypeRequest = {
  ipOrgId: string;
  relType: string;
  relatedElements: RelatedElements;
  allowedSrcIpAssetTypes: number[]; // the number is the index of the ip asset type array defined in ip org
  allowedDstIpAssetTypes: number[];
  preHooksConfig?: Array<TypedData>;
  postHooksConfig?: Array<TypedData>;
  txOptions?: TxOptions;
};

export type RegisterRelationshipTypeResponse = {
  txHash: string;
  success?: boolean;
  relationshipId?: string;
};
