compile_contracts:
	git submodule add --force https://github.com/storyprotocol/protocol-contracts packages/core-sdk/protocol-contracts
	git submodule update --remote --merge
	cd packages/core-sdk/protocol-contracts && npm i

	solc --pretty-json --base-path packages/core-sdk/protocol-contracts --include-path packages/core-sdk/protocol-contracts/node_modules/ --abi packages/core-sdk/protocol-contracts/contracts/StoryProtocol.sol -o packages/core-sdk/src/abi/json/tmp/StoryProtocol
	solc --pretty-json --base-path packages/core-sdk/protocol-contracts --include-path packages/core-sdk/protocol-contracts/node_modules/ --abi packages/core-sdk/protocol-contracts/contracts/ip-org/IPOrgController.sol -o packages/core-sdk/src/abi/json/tmp/IPOrgController
	solc --pretty-json --base-path packages/core-sdk/protocol-contracts --include-path packages/core-sdk/protocol-contracts/node_modules/ --abi packages/core-sdk/protocol-contracts/contracts/modules/licensing/LicenseRegistry.sol -o packages/core-sdk/src/abi/json/tmp/LicenseRegistry
	solc --pretty-json --base-path packages/core-sdk/protocol-contracts --include-path packages/core-sdk/protocol-contracts/node_modules/ --abi packages/core-sdk/protocol-contracts/contracts/modules/registration/RegistrationModule.sol -o packages/core-sdk/src/abi/json/tmp/RegistrationModule
	solc --pretty-json --base-path packages/core-sdk/protocol-contracts --include-path packages/core-sdk/protocol-contracts/node_modules/ --abi packages/core-sdk/protocol-contracts/contracts/modules/relationships/RelationshipModule.sol -o packages/core-sdk/src/abi/json/tmp/RelationshipModule
	solc --pretty-json --base-path packages/core-sdk/protocol-contracts --include-path packages/core-sdk/protocol-contracts/node_modules/ --abi packages/core-sdk/protocol-contracts/contracts/lib/Errors.sol -o packages/core-sdk/src/abi/json/tmp/Errors
	cp packages/core-sdk/src/abi/json/tmp/Errors/Errors.abi packages/core-sdk/src/abi/json/Errors.json

	jq --argjson entities "$$(jq -c '.' packages/core-sdk/src/abi/sdkEntities.json)" 'map(select(.name as $$name | $$entities | if type == "array" then index($$name) else false end))' packages/core-sdk/src/abi/json/tmp/StoryProtocol/StoryProtocol.abi > packages/core-sdk/src/abi/json/StoryProtocol.json
	jq --argjson entities "$$(jq -c '.' packages/core-sdk/src/abi/sdkEntities.json)" 'map(select(.name as $$name | $$entities | if type == "array" then index($$name) else false end))' packages/core-sdk/src/abi/json/tmp/IPOrgController/IPOrgController.abi > packages/core-sdk/src/abi/json/IPOrgController.json
	jq --argjson entities "$$(jq -c '.' packages/core-sdk/src/abi/sdkEntities.json)" 'map(select(.name as $$name | $$entities | if type == "array" then index($$name) else false end))' packages/core-sdk/src/abi/json/tmp/LicenseRegistry/LicenseRegistry.abi > packages/core-sdk/src/abi/json/LicenseRegistry.json
	jq --argjson entities "$$(jq -c '.' packages/core-sdk/src/abi/sdkEntities.json)" 'map(select(.name as $$name | $$entities | if type == "array" then index($$name) else false end))' packages/core-sdk/src/abi/json/tmp/RegistrationModule/RegistrationModule.abi > packages/core-sdk/src/abi/json/RegistrationModule.json
	jq --argjson entities "$$(jq -c '.' packages/core-sdk/src/abi/sdkEntities.json)" 'map(select(.name as $$name | $$entities | if type == "array" then index($$name) else false end))' packages/core-sdk/src/abi/json/tmp/RelationshipModule/RelationshipModule.abi > packages/core-sdk/src/abi/json/RelationshipModule.json

	rm -rf packages/core-sdk/src/abi/json/tmp
	rm -rf packages/core-sdk/protocol-contracts
