Welcome to Story Protocol Typescript SDK monorepo. The repo hosts tools and libraries for typescript/javascript developers to interact with the protocol. 

The repo is under construction and not meant for public use.

# Onboarding
* Install PNPM: Execute `npm install -g pnpm`
* Install TypeScript: Run `pnpm add typescript -D`
* Install Yalc: Use `npm install -g yalc`

# Steps for Using Yalc for Local Testing of Core-SDK
For manual testing of the core-sdk, set up a separate web project. The guide below uses `yalc` to link the `core-sdk` locally, enabling its installation and import for testing.

Under the `typescript-sdk/packages/core-sdk` directory:
* Navigate to the `core-sdk` directory.
* Execute `npm run build` to build your latest code.
* Run `yalc publish`. You should see a message like `@story-protocol/core-sdk@0.1.0-rc.7 published in store.` (Note: The version number may vary).

To set up your testing environment (e.g., a new Next.js project), use `yalc add @story-protocol/core-sdk@0.1.0-rc.7` (ensure the version number is updated accordingly).
* Run `pnpm install`. This installs `@story-protocol/core-sdk@0.1.0-rc.7` with your local changes.

## Steps to Refresh the Changes
Under the `typescript-sdk/packages/core-sdk` directory:
* Execute `npm run build` to build your latest code.
* Run `yalc push`.

In your testing environment:
* Run `yalc update` to pull the latest changes.


## Release

| Package                         | Description                                    |
| :------------------------------ | :--------------------------------------------- |
| [core-sdk](./packages/core-sdk) | The core sdk for interacting with the protocol |

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change. Details see: [CONTRIBUTING](/CONTRIBUTING.md)

Please make sure to update tests as appropriate.

## License

[MIT License](/LICENSE.md)

## Contact Us

