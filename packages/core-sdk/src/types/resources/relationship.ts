import { QueryOptions, TxOptions } from "../options";
import { TypedData } from "../common";

enum Relatables {
  UNDEFINED,
  IPA,
  IPORG_ENTRY,
  LICENSE,
  ADDRESS,
  EXTERNAL_NFT,
}

export interface RelatedElements {
  src: Relatables;
  dst: Relatables;
}

export type Relationship = {
  id: string;
  type: string; // i.e. "APPEARS_IN"
  typeId: string;
  srcContract: string;
  srcTokenId: string;
  srcName?: string;
  dstContract: string;
  dstTokenId: string;
  dstName?: string;
  ttl?: number; // based in seconds
  registeredAt: string; // ISO 8601
  txHash: string;
};

export type RegisterRelationshipRequest = {
  ipOrgId: string;
  relType: string;
  srcContract: string;
  srcTokenId: string;
  dstContract: string;
  dstTokenId: string;
  preHookData?: Array<TypedData>;
  postHookData?: Array<TypedData>;
  txOptions?: TxOptions;
};

export type RegisterRelationshipResponse = {
  txHash: string;
  relationshipId?: string;
  success?: boolean;
};

export type GetRelationshipRequest = {
  relationshipId: string;
  options?: QueryOptions;
};

export type GetRelationshipResponse = {
  relationship: Relationship;
};

export type ListRelationshipRequest = {
  tokenId: string;
  contract: string;
  options?: QueryOptions;
};
export type ListRelationshipResponse = {
  relationships: Relationship[];
};
