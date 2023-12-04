compile_contracts:
	git submodule add --force https://github.com/storyprotocol/protocol-contracts packages/core-sdk/protocol-contracts
	git submodule update --remote --merge
	cd packages/core-sdk/protocol-contracts && npm i

	solc --pretty-json --base-path packages/core-sdk/protocol-contracts --include-path packages/core-sdk/protocol-contracts/node_modules/ --abi packages/core-sdk/protocol-contracts/contracts/StoryProtocol.sol -o packages/core-sdk/src/abi/json/tmp/StoryProtocol
	cp packages/core-sdk/src/abi/json/tmp/StoryProtocol/StoryProtocol.abi packages/core-sdk/src/abi/json/StoryProtocol.json
	solc --pretty-json --base-path packages/core-sdk/protocol-contracts --include-path packages/core-sdk/protocol-contracts/node_modules/ --abi packages/core-sdk/protocol-contracts/contracts/ip-org/IPOrgController.sol -o packages/core-sdk/src/abi/json/tmp/IPOrgController
	cp packages/core-sdk/src/abi/json/tmp/IPOrgController/IPOrgController.abi packages/core-sdk/src/abi/json/IPOrgController.json
	solc --pretty-json --base-path packages/core-sdk/protocol-contracts --include-path packages/core-sdk/protocol-contracts/node_modules/ --abi packages/core-sdk/protocol-contracts/contracts/modules/licensing/LicenseRegistry.sol -o packages/core-sdk/src/abi/json/tmp/LicenseRegistry
	cp packages/core-sdk/src/abi/json/tmp/LicenseRegistry/LicenseRegistry.abi packages/core-sdk/src/abi/json/LicenseRegistry.json
	solc --pretty-json --base-path packages/core-sdk/protocol-contracts --include-path packages/core-sdk/protocol-contracts/node_modules/ --abi packages/core-sdk/protocol-contracts/contracts/modules/registration/RegistrationModule.sol -o packages/core-sdk/src/abi/json/tmp/RegistrationModule
	cp packages/core-sdk/src/abi/json/tmp/RegistrationModule/RegistrationModule.abi packages/core-sdk/src/abi/json/RegistrationModule.json
	solc --pretty-json --base-path packages/core-sdk/protocol-contracts --include-path packages/core-sdk/protocol-contracts/node_modules/ --abi packages/core-sdk/protocol-contracts/contracts/modules/relationships/RelationshipModule.sol -o packages/core-sdk/src/abi/json/tmp/RelationshipModule
	cp packages/core-sdk/src/abi/json/tmp/RelationshipModule/RelationshipModule.abi packages/core-sdk/src/abi/json/RelationshipModule.json

	solc --pretty-json --base-path packages/core-sdk/protocol-contracts --include-path packages/core-sdk/protocol-contracts/node_modules/ --abi packages/core-sdk/protocol-contracts/contracts/lib/Errors.sol -o packages/core-sdk/src/abi/json/tmp/Errors
	cp packages/core-sdk/src/abi/json/tmp/Errors/Errors.abi packages/core-sdk/src/abi/json/Errors.json

	rm -rf packages/core-sdk/src/abi/json/tmp
	rm -rf packages/core-sdk/protocol-contracts
