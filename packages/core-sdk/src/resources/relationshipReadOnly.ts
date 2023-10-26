import { RelationshipModule } from "../abi/generated/RelationshipModule";
import { FranchiseRegistry } from "../abi/generated";

/**
 * Client for managing relationships.
 */
export class RelationshipReadOnlyClient {
  protected readonly relationshipModule: RelationshipModule;
  protected readonly franchiseRegistry: FranchiseRegistry;

  /**
   * Creates a new RelationshipClient instance.
   * @param relationshipModule - The relationship module to interact with.
   * @param franchiseRegistry - The franchise registry to interact with.
   */
  constructor(relationshipModule: RelationshipModule, franchiseRegistry: FranchiseRegistry) {
    this.relationshipModule = relationshipModule;
    this.franchiseRegistry = franchiseRegistry;
  }
}
