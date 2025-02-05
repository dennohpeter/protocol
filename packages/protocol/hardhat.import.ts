/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';

require('dotenv').config({ path: path.join(__dirname, '../../.env') });
require('tsconfig-paths').register({ baseUrl: './', paths: require('./tsconfig.json').compilerOptions.paths });

import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import 'hardhat-deploy';
import 'hardhat-contract-sizer';
import './tasks/verify';
import './tasks/compile';

import type { HardhatUserConfig } from 'hardhat/types';

function node(networkName: string) {
  const fallback = 'http://localhost:8545';
  const uppercase = networkName.toUpperCase();

  return process.env[`ETHEREUM_NODE_${uppercase}`] || process.env.ETHEREUM_NODE || fallback;
}

function accounts(networkName: string) {
  const uppercase = networkName.toUpperCase();
  const accounts = process.env[`ETHEREUM_ACCOUNTS_${uppercase}`] || process.env.ETHEREUM_ACCOUNTS || '';

  return accounts
    .split(',')
    .map((account) => account.trim())
    .filter(Boolean);
}

const mnemonic = 'test test test test test test test test test test test junk';

export const config: HardhatUserConfig = {
  codeGenerator: {
    abi: {
      enabled: false,
    },
    bytecode: {
      enabled: false,
    },
    clear: true,
    enabled: true,
    include: [
      // Explicitly allow inclusion of core release interfaces.
      'IExternalPosition',
      'IExternalPositionParser',
      'IExternalPositionProxy',
      'IDerivativePriceFeed',
      'IExtension',
      'IIntegrationAdapter',
      'IFee',
      'IMigrationHookHandler',
      'IPolicy',
      'IPrimitivePriceFeed',
      'ITestAddOnlyAddressListOwner',
      'ITestBalancerV2Helpers',
      'ITestBalancerV2Vault',
      'ITestCERC20',
      'ITestChainlinkAggregator',
      'ITestCompoundComptroller',
      'ITestCompoundV3Comet',
      'ITestCompoundV3CometRewards',
      'ITestConvexBaseRewardPool',
      'ITestConvexBooster',
      'ITestConvexCrvDepositor',
      'ITestConvexCvxLocker',
      'ITestConvexVirtualBalanceRewardPool',
      'ITestConvexVlCvxExtraRewardDistribution',
      'ITestCurveAddressProvider',
      'ITestCurveLiquidityPool',
      'ITestCurveRegistry',
      'ITestCurveSwaps',
      'ITestIdleTokenV4',
      'ITestKilnStakingContract',
      'ITestLidoSteth',
      'ITestLiquityHintHelper',
      'ITestLiquitySortedTroves',
      'ITestLiquityTroveManager',
      'ITestGoldfinchConfig',
      'ITestGoldfinchSeniorPool',
      'ITestGsnForwarder',
      'ITestGsnRelayHub',
      'ITestMapleV2Pool',
      'ITestMapleV2PoolManager',
      'ITestMapleV2ProxyFactory',
      'ITestMapleV2WithdrawalManager',
      'ITestNotionalV2Router',
      'ITestSnapshotDelegateRegistry',
      'ITestSolvV2ConvertibleMarket',
      'ITestSolvV2ConvertiblePool',
      'ITestSolvV2ConvertibleVoucher',
      'ITestSolvV2InitialConvertibleOfferingMarket',
      'ITestSolvV2PriceOracleManager',
      'ITestSolvV2ManualPriceOracle',
      'ITestStandardToken',
      'ITestSynthetixExchanger',
      'ITestTheGraphEpochManager',
      'ITestTheGraphStaking',
      'ITestUniswapV2Pair',
      'ITestUniswapV2Router',
      'ITestUniswapV3NonFungibleTokenManager',
      'ITestVotiumMultiMerkleStash',
      'ITestWETH',
      'ITestYearnVaultV2',
    ],
    options: {
      ignoreContractsWithoutAbi: true,
      ignoreContractsWithoutBytecode: true,
    },
    typescript: {
      path: './packages/protocol/src/codegen',
    },
  },
  contractSizer: {
    disambiguatePaths: false,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: 0,
  },
  networks: {
    hardhat: {
      accounts: {
        count: 10,
        mnemonic,
      },
      blockGasLimit: 12450000,
      chainId: 1,
      forking: {
        blockNumber: 16185500, // Dec 14, 2022
        url: node('mainnet'),
      },
      gasPrice: 0, // TODO: Consider removing this again.
      initialBaseFeePerGas: 0,
    },
    mainnet: {
      accounts: accounts('mainnet'),
      url: node('mainnet'),
    },
    matic: {
      accounts: accounts('matic'),
      url: node('matic'),
    },
    testnet: {
      accounts: accounts('testnet'),
      url: node('testnet'),
    },
  },
  paths: {
    artifacts: './packages/protocol/artifacts',
    cache: './packages/protocol/cache',
    deployments: './packages/protocol/deployments',
    deploy: './packages/protocol/deploy/scripts',
  },
  solidity: {
    compilers: [
      {
        settings: {
          optimizer: {
            details: {
              yul: false,
            },
            enabled: true,
            runs: 200,
          },
        },
        version: '0.7.6',
      },
      {
        settings: {
          optimizer: {
            details: {
              yul: false,
            },
            enabled: true,
            runs: 200,
          },
        },
        version: '0.6.12',
      },
    ],
  },
};
