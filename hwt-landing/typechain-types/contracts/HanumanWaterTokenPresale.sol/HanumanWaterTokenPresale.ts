/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export interface HanumanWaterTokenPresaleInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "MAX_PURCHASE_AMOUNT_USD"
      | "MIN_PURCHASE_AMOUNT_USD"
      | "TOKEN_PRICE_USD"
      | "buyWithETH"
      | "buyWithUSDT"
      | "calculateTokensForEth"
      | "calculateTokensForUsdt"
      | "ethUsdPriceFeed"
      | "extendPresale"
      | "getEthUsdPrice"
      | "hwtToken"
      | "owner"
      | "pause"
      | "paused"
      | "presaleEndTime"
      | "renounceOwnership"
      | "totalTokensSold"
      | "transferOwnership"
      | "treasuryWallet"
      | "unpause"
      | "updatePriceFeed"
      | "updateTreasuryWallet"
      | "usdtToken"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "OwnershipTransferred"
      | "Paused"
      | "PresaleExtended"
      | "PriceFeedUpdated"
      | "TokensPurchasedWithETH"
      | "TokensPurchasedWithUSDT"
      | "TreasuryWalletUpdated"
      | "Unpaused"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "MAX_PURCHASE_AMOUNT_USD",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "MIN_PURCHASE_AMOUNT_USD",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "TOKEN_PRICE_USD",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "buyWithETH",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "buyWithUSDT",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "calculateTokensForEth",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "calculateTokensForUsdt",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "ethUsdPriceFeed",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "extendPresale",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getEthUsdPrice",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "hwtToken", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "presaleEndTime",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalTokensSold",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "treasuryWallet",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "updatePriceFeed",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateTreasuryWallet",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "usdtToken", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "MAX_PURCHASE_AMOUNT_USD",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "MIN_PURCHASE_AMOUNT_USD",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "TOKEN_PRICE_USD",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "buyWithETH", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "buyWithUSDT",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculateTokensForEth",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculateTokensForUsdt",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "ethUsdPriceFeed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "extendPresale",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getEthUsdPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "hwtToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "presaleEndTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalTokensSold",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "treasuryWallet",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "updatePriceFeed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateTreasuryWallet",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "usdtToken", data: BytesLike): Result;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PausedEvent {
  export type InputTuple = [account: AddressLike];
  export type OutputTuple = [account: string];
  export interface OutputObject {
    account: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PresaleExtendedEvent {
  export type InputTuple = [oldEndTime: BigNumberish, newEndTime: BigNumberish];
  export type OutputTuple = [oldEndTime: bigint, newEndTime: bigint];
  export interface OutputObject {
    oldEndTime: bigint;
    newEndTime: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PriceFeedUpdatedEvent {
  export type InputTuple = [
    oldPriceFeed: AddressLike,
    newPriceFeed: AddressLike
  ];
  export type OutputTuple = [oldPriceFeed: string, newPriceFeed: string];
  export interface OutputObject {
    oldPriceFeed: string;
    newPriceFeed: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TokensPurchasedWithETHEvent {
  export type InputTuple = [
    buyer: AddressLike,
    ethAmount: BigNumberish,
    tokenAmount: BigNumberish,
    ethPrice: BigNumberish
  ];
  export type OutputTuple = [
    buyer: string,
    ethAmount: bigint,
    tokenAmount: bigint,
    ethPrice: bigint
  ];
  export interface OutputObject {
    buyer: string;
    ethAmount: bigint;
    tokenAmount: bigint;
    ethPrice: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TokensPurchasedWithUSDTEvent {
  export type InputTuple = [
    buyer: AddressLike,
    usdtAmount: BigNumberish,
    tokenAmount: BigNumberish
  ];
  export type OutputTuple = [
    buyer: string,
    usdtAmount: bigint,
    tokenAmount: bigint
  ];
  export interface OutputObject {
    buyer: string;
    usdtAmount: bigint;
    tokenAmount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TreasuryWalletUpdatedEvent {
  export type InputTuple = [oldWallet: AddressLike, newWallet: AddressLike];
  export type OutputTuple = [oldWallet: string, newWallet: string];
  export interface OutputObject {
    oldWallet: string;
    newWallet: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UnpausedEvent {
  export type InputTuple = [account: AddressLike];
  export type OutputTuple = [account: string];
  export interface OutputObject {
    account: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface HanumanWaterTokenPresale extends BaseContract {
  connect(runner?: ContractRunner | null): HanumanWaterTokenPresale;
  waitForDeployment(): Promise<this>;

  interface: HanumanWaterTokenPresaleInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  MAX_PURCHASE_AMOUNT_USD: TypedContractMethod<[], [bigint], "view">;

  MIN_PURCHASE_AMOUNT_USD: TypedContractMethod<[], [bigint], "view">;

  TOKEN_PRICE_USD: TypedContractMethod<[], [bigint], "view">;

  buyWithETH: TypedContractMethod<[], [void], "payable">;

  buyWithUSDT: TypedContractMethod<
    [usdtAmount: BigNumberish],
    [void],
    "nonpayable"
  >;

  calculateTokensForEth: TypedContractMethod<
    [ethAmount: BigNumberish],
    [bigint],
    "view"
  >;

  calculateTokensForUsdt: TypedContractMethod<
    [usdtAmount: BigNumberish],
    [bigint],
    "view"
  >;

  ethUsdPriceFeed: TypedContractMethod<[], [string], "view">;

  extendPresale: TypedContractMethod<
    [_newEndTime: BigNumberish],
    [void],
    "nonpayable"
  >;

  getEthUsdPrice: TypedContractMethod<[], [bigint], "view">;

  hwtToken: TypedContractMethod<[], [string], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  pause: TypedContractMethod<[], [void], "nonpayable">;

  paused: TypedContractMethod<[], [boolean], "view">;

  presaleEndTime: TypedContractMethod<[], [bigint], "view">;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  totalTokensSold: TypedContractMethod<[], [bigint], "view">;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  treasuryWallet: TypedContractMethod<[], [string], "view">;

  unpause: TypedContractMethod<[], [void], "nonpayable">;

  updatePriceFeed: TypedContractMethod<
    [_newPriceFeed: AddressLike],
    [void],
    "nonpayable"
  >;

  updateTreasuryWallet: TypedContractMethod<
    [_newTreasuryWallet: AddressLike],
    [void],
    "nonpayable"
  >;

  usdtToken: TypedContractMethod<[], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "MAX_PURCHASE_AMOUNT_USD"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "MIN_PURCHASE_AMOUNT_USD"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "TOKEN_PRICE_USD"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "buyWithETH"
  ): TypedContractMethod<[], [void], "payable">;
  getFunction(
    nameOrSignature: "buyWithUSDT"
  ): TypedContractMethod<[usdtAmount: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "calculateTokensForEth"
  ): TypedContractMethod<[ethAmount: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "calculateTokensForUsdt"
  ): TypedContractMethod<[usdtAmount: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "ethUsdPriceFeed"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "extendPresale"
  ): TypedContractMethod<[_newEndTime: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "getEthUsdPrice"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "hwtToken"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "pause"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "paused"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "presaleEndTime"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "totalTokensSold"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "treasuryWallet"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "unpause"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updatePriceFeed"
  ): TypedContractMethod<[_newPriceFeed: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateTreasuryWallet"
  ): TypedContractMethod<
    [_newTreasuryWallet: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "usdtToken"
  ): TypedContractMethod<[], [string], "view">;

  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "Paused"
  ): TypedContractEvent<
    PausedEvent.InputTuple,
    PausedEvent.OutputTuple,
    PausedEvent.OutputObject
  >;
  getEvent(
    key: "PresaleExtended"
  ): TypedContractEvent<
    PresaleExtendedEvent.InputTuple,
    PresaleExtendedEvent.OutputTuple,
    PresaleExtendedEvent.OutputObject
  >;
  getEvent(
    key: "PriceFeedUpdated"
  ): TypedContractEvent<
    PriceFeedUpdatedEvent.InputTuple,
    PriceFeedUpdatedEvent.OutputTuple,
    PriceFeedUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "TokensPurchasedWithETH"
  ): TypedContractEvent<
    TokensPurchasedWithETHEvent.InputTuple,
    TokensPurchasedWithETHEvent.OutputTuple,
    TokensPurchasedWithETHEvent.OutputObject
  >;
  getEvent(
    key: "TokensPurchasedWithUSDT"
  ): TypedContractEvent<
    TokensPurchasedWithUSDTEvent.InputTuple,
    TokensPurchasedWithUSDTEvent.OutputTuple,
    TokensPurchasedWithUSDTEvent.OutputObject
  >;
  getEvent(
    key: "TreasuryWalletUpdated"
  ): TypedContractEvent<
    TreasuryWalletUpdatedEvent.InputTuple,
    TreasuryWalletUpdatedEvent.OutputTuple,
    TreasuryWalletUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "Unpaused"
  ): TypedContractEvent<
    UnpausedEvent.InputTuple,
    UnpausedEvent.OutputTuple,
    UnpausedEvent.OutputObject
  >;

  filters: {
    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "Paused(address)": TypedContractEvent<
      PausedEvent.InputTuple,
      PausedEvent.OutputTuple,
      PausedEvent.OutputObject
    >;
    Paused: TypedContractEvent<
      PausedEvent.InputTuple,
      PausedEvent.OutputTuple,
      PausedEvent.OutputObject
    >;

    "PresaleExtended(uint256,uint256)": TypedContractEvent<
      PresaleExtendedEvent.InputTuple,
      PresaleExtendedEvent.OutputTuple,
      PresaleExtendedEvent.OutputObject
    >;
    PresaleExtended: TypedContractEvent<
      PresaleExtendedEvent.InputTuple,
      PresaleExtendedEvent.OutputTuple,
      PresaleExtendedEvent.OutputObject
    >;

    "PriceFeedUpdated(address,address)": TypedContractEvent<
      PriceFeedUpdatedEvent.InputTuple,
      PriceFeedUpdatedEvent.OutputTuple,
      PriceFeedUpdatedEvent.OutputObject
    >;
    PriceFeedUpdated: TypedContractEvent<
      PriceFeedUpdatedEvent.InputTuple,
      PriceFeedUpdatedEvent.OutputTuple,
      PriceFeedUpdatedEvent.OutputObject
    >;

    "TokensPurchasedWithETH(address,uint256,uint256,uint256)": TypedContractEvent<
      TokensPurchasedWithETHEvent.InputTuple,
      TokensPurchasedWithETHEvent.OutputTuple,
      TokensPurchasedWithETHEvent.OutputObject
    >;
    TokensPurchasedWithETH: TypedContractEvent<
      TokensPurchasedWithETHEvent.InputTuple,
      TokensPurchasedWithETHEvent.OutputTuple,
      TokensPurchasedWithETHEvent.OutputObject
    >;

    "TokensPurchasedWithUSDT(address,uint256,uint256)": TypedContractEvent<
      TokensPurchasedWithUSDTEvent.InputTuple,
      TokensPurchasedWithUSDTEvent.OutputTuple,
      TokensPurchasedWithUSDTEvent.OutputObject
    >;
    TokensPurchasedWithUSDT: TypedContractEvent<
      TokensPurchasedWithUSDTEvent.InputTuple,
      TokensPurchasedWithUSDTEvent.OutputTuple,
      TokensPurchasedWithUSDTEvent.OutputObject
    >;

    "TreasuryWalletUpdated(address,address)": TypedContractEvent<
      TreasuryWalletUpdatedEvent.InputTuple,
      TreasuryWalletUpdatedEvent.OutputTuple,
      TreasuryWalletUpdatedEvent.OutputObject
    >;
    TreasuryWalletUpdated: TypedContractEvent<
      TreasuryWalletUpdatedEvent.InputTuple,
      TreasuryWalletUpdatedEvent.OutputTuple,
      TreasuryWalletUpdatedEvent.OutputObject
    >;

    "Unpaused(address)": TypedContractEvent<
      UnpausedEvent.InputTuple,
      UnpausedEvent.OutputTuple,
      UnpausedEvent.OutputObject
    >;
    Unpaused: TypedContractEvent<
      UnpausedEvent.InputTuple,
      UnpausedEvent.OutputTuple,
      UnpausedEvent.OutputObject
    >;
  };
}
