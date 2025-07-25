/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  MockPriceFeed,
  MockPriceFeedInterface,
} from "../../../contracts/mocks/MockPriceFeed";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "description",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint80",
        name: "_roundId",
        type: "uint80",
      },
    ],
    name: "getRoundData",
    outputs: [
      {
        internalType: "uint80",
        name: "roundId",
        type: "uint80",
      },
      {
        internalType: "int256",
        name: "answer",
        type: "int256",
      },
      {
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256",
      },
      {
        internalType: "uint80",
        name: "answeredInRound",
        type: "uint80",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      {
        internalType: "uint80",
        name: "roundId",
        type: "uint80",
      },
      {
        internalType: "int256",
        name: "answer",
        type: "int256",
      },
      {
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256",
      },
      {
        internalType: "uint80",
        name: "answeredInRound",
        type: "uint80",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "price",
        type: "int256",
      },
    ],
    name: "setLatestPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080604052600060025534801561001557600080fd5b5033600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036100895760006040517f1e4fbdf700000000000000000000000000000000000000000000000000000000815260040161008091906101bd565b60405180910390fd5b610098816100b860201b60201c565b50642e90edd00060018190555042600381905550426004819055506101d8565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006101a78261017c565b9050919050565b6101b78161019c565b82525050565b60006020820190506101d260008301846101ae565b92915050565b610853806101e76000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c8063805fe7fb11610066578063805fe7fb146100fc5780638da5cb5b146101185780639a6fc8f514610136578063f2fde38b1461016a578063feaf968c1461018657610093565b8063313ce5671461009857806354fd4d50146100b6578063715018a6146100d45780637284e416146100de575b600080fd5b6100a06101a8565b6040516100ad91906104a8565b60405180910390f35b6100be6101b1565b6040516100cb91906104dc565b60405180910390f35b6100dc6101ba565b005b6100e66101ce565b6040516100f39190610587565b60405180910390f35b610116600480360381019061011191906105e4565b61020b565b005b61012061023c565b60405161012d9190610652565b60405180910390f35b610150600480360381019061014b91906106af565b610265565b6040516101619594939291906106fa565b60405180910390f35b610184600480360381019061017f9190610779565b61028b565b005b61018e610311565b60405161019f9594939291906106fa565b60405180910390f35b60006008905090565b60006001905090565b6101c2610339565b6101cc60006103c0565b565b60606040518060400160405280601781526020017f4d6f636b204554482f5553442050726963652046656564000000000000000000815250905090565b610213610339565b806001819055506002600081548092919061022d906107d5565b91905055504260048190555050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600080600080600085600154600354600454899450945094509450945091939590929450565b610293610339565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036103055760006040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016102fc9190610652565b60405180910390fd5b61030e816103c0565b50565b6000806000806000600254600154600354600454600254945094509450945094509091929394565b610341610484565b73ffffffffffffffffffffffffffffffffffffffff1661035f61023c565b73ffffffffffffffffffffffffffffffffffffffff16146103be57610382610484565b6040517f118cdaa70000000000000000000000000000000000000000000000000000000081526004016103b59190610652565b60405180910390fd5b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600033905090565b600060ff82169050919050565b6104a28161048c565b82525050565b60006020820190506104bd6000830184610499565b92915050565b6000819050919050565b6104d6816104c3565b82525050565b60006020820190506104f160008301846104cd565b92915050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610531578082015181840152602081019050610516565b60008484015250505050565b6000601f19601f8301169050919050565b6000610559826104f7565b6105638185610502565b9350610573818560208601610513565b61057c8161053d565b840191505092915050565b600060208201905081810360008301526105a1818461054e565b905092915050565b600080fd5b6000819050919050565b6105c1816105ae565b81146105cc57600080fd5b50565b6000813590506105de816105b8565b92915050565b6000602082840312156105fa576105f96105a9565b5b6000610608848285016105cf565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061063c82610611565b9050919050565b61064c81610631565b82525050565b60006020820190506106676000830184610643565b92915050565b600069ffffffffffffffffffff82169050919050565b61068c8161066d565b811461069757600080fd5b50565b6000813590506106a981610683565b92915050565b6000602082840312156106c5576106c46105a9565b5b60006106d38482850161069a565b91505092915050565b6106e58161066d565b82525050565b6106f4816105ae565b82525050565b600060a08201905061070f60008301886106dc565b61071c60208301876106eb565b61072960408301866104cd565b61073660608301856104cd565b61074360808301846106dc565b9695505050505050565b61075681610631565b811461076157600080fd5b50565b6000813590506107738161074d565b92915050565b60006020828403121561078f5761078e6105a9565b5b600061079d84828501610764565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006107e0826104c3565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203610812576108116107a6565b5b60018201905091905056fea264697066735822122086b6c4eb0509bf00b4d19c69391d0e6fdb8137236b62071a4729c98d613bcbc664736f6c63430008140033";

type MockPriceFeedConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockPriceFeedConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockPriceFeed__factory extends ContractFactory {
  constructor(...args: MockPriceFeedConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      MockPriceFeed & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): MockPriceFeed__factory {
    return super.connect(runner) as MockPriceFeed__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockPriceFeedInterface {
    return new Interface(_abi) as MockPriceFeedInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): MockPriceFeed {
    return new Contract(address, _abi, runner) as unknown as MockPriceFeed;
  }
}
