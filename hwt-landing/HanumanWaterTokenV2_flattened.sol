// Sources flattened with hardhat v2.26.1 https://hardhat.org

// SPDX-License-Identifier: MIT

// File @openzeppelin/contracts/utils/Context.sol@v5.4.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.1) (utils/Context.sol)

pragma solidity ^0.8.20;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}


// File @openzeppelin/contracts/access/Ownable.sol@v5.4.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (access/Ownable.sol)

pragma solidity ^0.8.20;

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * The initial owner is set to the address provided by the deployer. This can
 * later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    constructor(address initialOwner) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        if (owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}


// File @openzeppelin/contracts/interfaces/draft-IERC6093.sol@v5.4.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.4.0) (interfaces/draft-IERC6093.sol)
pragma solidity >=0.8.4;

/**
 * @dev Standard ERC-20 Errors
 * Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC-20 tokens.
 */
interface IERC20Errors {
    /**
     * @dev Indicates an error related to the current `balance` of a `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     * @param balance Current balance for the interacting account.
     * @param needed Minimum amount required to perform a transfer.
     */
    error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed);

    /**
     * @dev Indicates a failure with the token `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     */
    error ERC20InvalidSender(address sender);

    /**
     * @dev Indicates a failure with the token `receiver`. Used in transfers.
     * @param receiver Address to which tokens are being transferred.
     */
    error ERC20InvalidReceiver(address receiver);

    /**
     * @dev Indicates a failure with the `spender`’s `allowance`. Used in transfers.
     * @param spender Address that may be allowed to operate on tokens without being their owner.
     * @param allowance Amount of tokens a `spender` is allowed to operate with.
     * @param needed Minimum amount required to perform a transfer.
     */
    error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed);

    /**
     * @dev Indicates a failure with the `approver` of a token to be approved. Used in approvals.
     * @param approver Address initiating an approval operation.
     */
    error ERC20InvalidApprover(address approver);

    /**
     * @dev Indicates a failure with the `spender` to be approved. Used in approvals.
     * @param spender Address that may be allowed to operate on tokens without being their owner.
     */
    error ERC20InvalidSpender(address spender);
}

/**
 * @dev Standard ERC-721 Errors
 * Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC-721 tokens.
 */
interface IERC721Errors {
    /**
     * @dev Indicates that an address can't be an owner. For example, `address(0)` is a forbidden owner in ERC-20.
     * Used in balance queries.
     * @param owner Address of the current owner of a token.
     */
    error ERC721InvalidOwner(address owner);

    /**
     * @dev Indicates a `tokenId` whose `owner` is the zero address.
     * @param tokenId Identifier number of a token.
     */
    error ERC721NonexistentToken(uint256 tokenId);

    /**
     * @dev Indicates an error related to the ownership over a particular token. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     * @param tokenId Identifier number of a token.
     * @param owner Address of the current owner of a token.
     */
    error ERC721IncorrectOwner(address sender, uint256 tokenId, address owner);

    /**
     * @dev Indicates a failure with the token `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     */
    error ERC721InvalidSender(address sender);

    /**
     * @dev Indicates a failure with the token `receiver`. Used in transfers.
     * @param receiver Address to which tokens are being transferred.
     */
    error ERC721InvalidReceiver(address receiver);

    /**
     * @dev Indicates a failure with the `operator`’s approval. Used in transfers.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     * @param tokenId Identifier number of a token.
     */
    error ERC721InsufficientApproval(address operator, uint256 tokenId);

    /**
     * @dev Indicates a failure with the `approver` of a token to be approved. Used in approvals.
     * @param approver Address initiating an approval operation.
     */
    error ERC721InvalidApprover(address approver);

    /**
     * @dev Indicates a failure with the `operator` to be approved. Used in approvals.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     */
    error ERC721InvalidOperator(address operator);
}

/**
 * @dev Standard ERC-1155 Errors
 * Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC-1155 tokens.
 */
interface IERC1155Errors {
    /**
     * @dev Indicates an error related to the current `balance` of a `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     * @param balance Current balance for the interacting account.
     * @param needed Minimum amount required to perform a transfer.
     * @param tokenId Identifier number of a token.
     */
    error ERC1155InsufficientBalance(address sender, uint256 balance, uint256 needed, uint256 tokenId);

    /**
     * @dev Indicates a failure with the token `sender`. Used in transfers.
     * @param sender Address whose tokens are being transferred.
     */
    error ERC1155InvalidSender(address sender);

    /**
     * @dev Indicates a failure with the token `receiver`. Used in transfers.
     * @param receiver Address to which tokens are being transferred.
     */
    error ERC1155InvalidReceiver(address receiver);

    /**
     * @dev Indicates a failure with the `operator`’s approval. Used in transfers.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     * @param owner Address of the current owner of a token.
     */
    error ERC1155MissingApprovalForAll(address operator, address owner);

    /**
     * @dev Indicates a failure with the `approver` of a token to be approved. Used in approvals.
     * @param approver Address initiating an approval operation.
     */
    error ERC1155InvalidApprover(address approver);

    /**
     * @dev Indicates a failure with the `operator` to be approved. Used in approvals.
     * @param operator Address that may be allowed to operate on tokens without being their owner.
     */
    error ERC1155InvalidOperator(address operator);

    /**
     * @dev Indicates an array length mismatch between ids and values in a safeBatchTransferFrom operation.
     * Used in batch transfers.
     * @param idsLength Length of the array of token identifiers
     * @param valuesLength Length of the array of token amounts
     */
    error ERC1155InvalidArrayLength(uint256 idsLength, uint256 valuesLength);
}


// File @openzeppelin/contracts/token/ERC20/IERC20.sol@v5.4.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/IERC20.sol)

pragma solidity >=0.4.16;

/**
 * @dev Interface of the ERC-20 standard as defined in the ERC.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}


// File @openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol@v5.4.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/extensions/IERC20Metadata.sol)

pragma solidity >=0.6.2;

/**
 * @dev Interface for the optional metadata functions from the ERC-20 standard.
 */
interface IERC20Metadata is IERC20 {
    /**
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the decimals places of the token.
     */
    function decimals() external view returns (uint8);
}


// File @openzeppelin/contracts/token/ERC20/ERC20.sol@v5.4.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.20;




/**
 * @dev Implementation of the {IERC20} interface.
 *
 * This implementation is agnostic to the way tokens are created. This means
 * that a supply mechanism has to be added in a derived contract using {_mint}.
 *
 * TIP: For a detailed writeup see our guide
 * https://forum.openzeppelin.com/t/how-to-implement-erc20-supply-mechanisms/226[How
 * to implement supply mechanisms].
 *
 * The default value of {decimals} is 18. To change this, you should override
 * this function so it returns a different value.
 *
 * We have followed general OpenZeppelin Contracts guidelines: functions revert
 * instead returning `false` on failure. This behavior is nonetheless
 * conventional and does not conflict with the expectations of ERC-20
 * applications.
 */
abstract contract ERC20 is Context, IERC20, IERC20Metadata, IERC20Errors {
    mapping(address account => uint256) private _balances;

    mapping(address account => mapping(address spender => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;

    /**
     * @dev Sets the values for {name} and {symbol}.
     *
     * Both values are immutable: they can only be set once during construction.
     */
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() public view virtual returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the default value returned by this function, unless
     * it's overridden.
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() public view virtual returns (uint8) {
        return 18;
    }

    /// @inheritdoc IERC20
    function totalSupply() public view virtual returns (uint256) {
        return _totalSupply;
    }

    /// @inheritdoc IERC20
    function balanceOf(address account) public view virtual returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - the caller must have a balance of at least `value`.
     */
    function transfer(address to, uint256 value) public virtual returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, value);
        return true;
    }

    /// @inheritdoc IERC20
    function allowance(address owner, address spender) public view virtual returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     * @dev See {IERC20-approve}.
     *
     * NOTE: If `value` is the maximum `uint256`, the allowance is not updated on
     * `transferFrom`. This is semantically equivalent to an infinite approval.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function approve(address spender, uint256 value) public virtual returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, value);
        return true;
    }

    /**
     * @dev See {IERC20-transferFrom}.
     *
     * Skips emitting an {Approval} event indicating an allowance update. This is not
     * required by the ERC. See {xref-ERC20-_approve-address-address-uint256-bool-}[_approve].
     *
     * NOTE: Does not update the allowance if the current allowance
     * is the maximum `uint256`.
     *
     * Requirements:
     *
     * - `from` and `to` cannot be the zero address.
     * - `from` must have a balance of at least `value`.
     * - the caller must have allowance for ``from``'s tokens of at least
     * `value`.
     */
    function transferFrom(address from, address to, uint256 value) public virtual returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, value);
        _transfer(from, to, value);
        return true;
    }

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to`.
     *
     * This internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * NOTE: This function is not virtual, {_update} should be overridden instead.
     */
    function _transfer(address from, address to, uint256 value) internal {
        if (from == address(0)) {
            revert ERC20InvalidSender(address(0));
        }
        if (to == address(0)) {
            revert ERC20InvalidReceiver(address(0));
        }
        _update(from, to, value);
    }

    /**
     * @dev Transfers a `value` amount of tokens from `from` to `to`, or alternatively mints (or burns) if `from`
     * (or `to`) is the zero address. All customizations to transfers, mints, and burns should be done by overriding
     * this function.
     *
     * Emits a {Transfer} event.
     */
    function _update(address from, address to, uint256 value) internal virtual {
        if (from == address(0)) {
            // Overflow check required: The rest of the code assumes that totalSupply never overflows
            _totalSupply += value;
        } else {
            uint256 fromBalance = _balances[from];
            if (fromBalance < value) {
                revert ERC20InsufficientBalance(from, fromBalance, value);
            }
            unchecked {
                // Overflow not possible: value <= fromBalance <= totalSupply.
                _balances[from] = fromBalance - value;
            }
        }

        if (to == address(0)) {
            unchecked {
                // Overflow not possible: value <= totalSupply or value <= fromBalance <= totalSupply.
                _totalSupply -= value;
            }
        } else {
            unchecked {
                // Overflow not possible: balance + value is at most totalSupply, which we know fits into a uint256.
                _balances[to] += value;
            }
        }

        emit Transfer(from, to, value);
    }

    /**
     * @dev Creates a `value` amount of tokens and assigns them to `account`, by transferring it from address(0).
     * Relies on the `_update` mechanism
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * NOTE: This function is not virtual, {_update} should be overridden instead.
     */
    function _mint(address account, uint256 value) internal {
        if (account == address(0)) {
            revert ERC20InvalidReceiver(address(0));
        }
        _update(address(0), account, value);
    }

    /**
     * @dev Destroys a `value` amount of tokens from `account`, lowering the total supply.
     * Relies on the `_update` mechanism.
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     *
     * NOTE: This function is not virtual, {_update} should be overridden instead
     */
    function _burn(address account, uint256 value) internal {
        if (account == address(0)) {
            revert ERC20InvalidSender(address(0));
        }
        _update(account, address(0), value);
    }

    /**
     * @dev Sets `value` as the allowance of `spender` over the `owner`'s tokens.
     *
     * This internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     *
     * Overrides to this logic should be done to the variant with an additional `bool emitEvent` argument.
     */
    function _approve(address owner, address spender, uint256 value) internal {
        _approve(owner, spender, value, true);
    }

    /**
     * @dev Variant of {_approve} with an optional flag to enable or disable the {Approval} event.
     *
     * By default (when calling {_approve}) the flag is set to true. On the other hand, approval changes made by
     * `_spendAllowance` during the `transferFrom` operation set the flag to false. This saves gas by not emitting any
     * `Approval` event during `transferFrom` operations.
     *
     * Anyone who wishes to continue emitting `Approval` events on the`transferFrom` operation can force the flag to
     * true using the following override:
     *
     * ```solidity
     * function _approve(address owner, address spender, uint256 value, bool) internal virtual override {
     *     super._approve(owner, spender, value, true);
     * }
     * ```
     *
     * Requirements are the same as {_approve}.
     */
    function _approve(address owner, address spender, uint256 value, bool emitEvent) internal virtual {
        if (owner == address(0)) {
            revert ERC20InvalidApprover(address(0));
        }
        if (spender == address(0)) {
            revert ERC20InvalidSpender(address(0));
        }
        _allowances[owner][spender] = value;
        if (emitEvent) {
            emit Approval(owner, spender, value);
        }
    }

    /**
     * @dev Updates `owner`'s allowance for `spender` based on spent `value`.
     *
     * Does not update the allowance value in case of infinite allowance.
     * Revert if not enough allowance is available.
     *
     * Does not emit an {Approval} event.
     */
    function _spendAllowance(address owner, address spender, uint256 value) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance < type(uint256).max) {
            if (currentAllowance < value) {
                revert ERC20InsufficientAllowance(spender, currentAllowance, value);
            }
            unchecked {
                _approve(owner, spender, currentAllowance - value, false);
            }
        }
    }
}


// File @openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol@v5.4.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/extensions/ERC20Burnable.sol)

pragma solidity ^0.8.20;


/**
 * @dev Extension of {ERC20} that allows token holders to destroy both their own
 * tokens and those that they have an allowance for, in a way that can be
 * recognized off-chain (via event analysis).
 */
abstract contract ERC20Burnable is Context, ERC20 {
    /**
     * @dev Destroys a `value` amount of tokens from the caller.
     *
     * See {ERC20-_burn}.
     */
    function burn(uint256 value) public virtual {
        _burn(_msgSender(), value);
    }

    /**
     * @dev Destroys a `value` amount of tokens from `account`, deducting from
     * the caller's allowance.
     *
     * See {ERC20-_burn} and {ERC20-allowance}.
     *
     * Requirements:
     *
     * - the caller must have allowance for ``accounts``'s tokens of at least
     * `value`.
     */
    function burnFrom(address account, uint256 value) public virtual {
        _spendAllowance(account, _msgSender(), value);
        _burn(account, value);
    }
}


// File @openzeppelin/contracts/utils/Pausable.sol@v5.4.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.3.0) (utils/Pausable.sol)

pragma solidity ^0.8.20;

/**
 * @dev Contract module which allows children to implement an emergency stop
 * mechanism that can be triggered by an authorized account.
 *
 * This module is used through inheritance. It will make available the
 * modifiers `whenNotPaused` and `whenPaused`, which can be applied to
 * the functions of your contract. Note that they will not be pausable by
 * simply including this module, only once the modifiers are put in place.
 */
abstract contract Pausable is Context {
    bool private _paused;

    /**
     * @dev Emitted when the pause is triggered by `account`.
     */
    event Paused(address account);

    /**
     * @dev Emitted when the pause is lifted by `account`.
     */
    event Unpaused(address account);

    /**
     * @dev The operation failed because the contract is paused.
     */
    error EnforcedPause();

    /**
     * @dev The operation failed because the contract is not paused.
     */
    error ExpectedPause();

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    modifier whenNotPaused() {
        _requireNotPaused();
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    modifier whenPaused() {
        _requirePaused();
        _;
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function paused() public view virtual returns (bool) {
        return _paused;
    }

    /**
     * @dev Throws if the contract is paused.
     */
    function _requireNotPaused() internal view virtual {
        if (paused()) {
            revert EnforcedPause();
        }
    }

    /**
     * @dev Throws if the contract is not paused.
     */
    function _requirePaused() internal view virtual {
        if (!paused()) {
            revert ExpectedPause();
        }
    }

    /**
     * @dev Triggers stopped state.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    function _pause() internal virtual whenNotPaused {
        _paused = true;
        emit Paused(_msgSender());
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function _unpause() internal virtual whenPaused {
        _paused = false;
        emit Unpaused(_msgSender());
    }
}


// File @openzeppelin/contracts/utils/ReentrancyGuard.sol@v5.4.0

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.1.0) (utils/ReentrancyGuard.sol)

pragma solidity ^0.8.20;

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If EIP-1153 (transient storage) is available on the chain you're deploying at,
 * consider using {ReentrancyGuardTransient} instead.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;

    uint256 private _status;

    /**
     * @dev Unauthorized reentrant call.
     */
    error ReentrancyGuardReentrantCall();

    constructor() {
        _status = NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be NOT_ENTERED
        if (_status == ENTERED) {
            revert ReentrancyGuardReentrantCall();
        }

        // Any calls to nonReentrant after this point will fail
        _status = ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _status == ENTERED;
    }
}


// File contracts/HanumanWaterTokenV2.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.20;





/**
 * @title HanumanWaterToken
 * @dev Token ERC-20 representando direitos sobre água mineral da Fonte Hanuman
 * Cada token equivale a 1 litro de água mineral premium
 */
contract HanumanWaterTokenV2 is ERC20, ERC20Burnable, Ownable, Pausable, ReentrancyGuard {
    // Constantes
    uint256 public constant TOKEN_PRICE_USD = 2;
    uint256 public constant MIN_REDEMPTION_AMOUNT = 100; // 100 litros
    uint256 public constant MAX_SUPPLY = 500_000_000 * 10**18; // 500 milhões de tokens
    uint256 public constant PUBLIC_ALLOCATION_PERCENTAGE = 80; // 80% para distribuição pública
    
    // Variáveis de estado
    uint256 public presaleEndTime;
    address public developmentTeamWallet;
    address public liquidityReserveWallet;
    address public strategicPartnershipsWallet;
    address public presaleContractAddress;
    
    // Contadores para controle de distribuição
    uint256 public totalPublicAllocation;
    uint256 public totalTeamAllocation;
    uint256 public totalLiquidityAllocation;
    uint256 public totalPartnershipsAllocation;
    uint256 public totalCommunityAllocation;
    uint256 public totalConsultantsAllocation;
    
    // Limites máximos para cada categoria
    uint256 public constant MAX_PUBLIC_ALLOCATION = (MAX_SUPPLY * PUBLIC_ALLOCATION_PERCENTAGE) / 100;
    uint256 public constant MAX_TEAM_ALLOCATION = (MAX_SUPPLY * 6) / 100; // 6%
    uint256 public constant MAX_LIQUIDITY_ALLOCATION = (MAX_SUPPLY * 5) / 100; // 5%
    uint256 public constant MAX_PARTNERSHIPS_ALLOCATION = (MAX_SUPPLY * 3) / 100; // 3%
    uint256 public constant MAX_COMMUNITY_ALLOCATION = (MAX_SUPPLY * 3) / 100; // 3%
    uint256 public constant MAX_CONSULTANTS_ALLOCATION = (MAX_SUPPLY * 3) / 100; // 3%
    
    // Limites da pré-venda
    uint256 public constant MAX_PRESALE_DURATION = 365 days; // Duração máxima da pré-venda: 1 ano
    uint256 public constant TOTAL_PRESALE_TOKENS = 100000000 * 10**18; // 100 milhões de tokens para pré-venda
    
    // Mapeamento para controle KYC
    mapping(address => bool) public kycApproved;
    
    // Estrutura para rastrear resgates de água
    struct WaterRedemption {
        address redeemer;
        uint256 amount;
        uint256 requestTime;
        uint256 expiryTime;
        bool delivered;
        bool cancelled;
        bool refunded;
        string deliveryDetails;
    }
    
    // Contador e mapeamento para resgates
    uint256 public nextRedemptionId = 1;
    mapping(uint256 => WaterRedemption) public waterRedemptions;
    
    // Período de tempo para confirmação de entrega (30 dias por padrão)
    uint256 public redemptionExpiryPeriod = 30 days;
    
    // Endereço do operador de entrega (pode confirmar entregas)
    address public deliveryOperator;
    
    // Eventos
    event TokensPurchased(address indexed buyer, uint256 amount, string paymentMethod);
    event WaterRedeemed(address indexed redeemer, uint256 tokenAmount, uint256 waterAmount, uint256 redemptionId);
    event WaterRedemptionConfirmed(uint256 indexed redemptionId, address indexed redeemer, uint256 amount);
    event WaterRedemptionCancelled(uint256 indexed redemptionId, address indexed redeemer, uint256 amount, string reason);
    event WaterRedemptionRefunded(uint256 indexed redemptionId, address indexed redeemer, uint256 amount);
    event WalletsUpdated(address newDevelopmentTeamWallet, address newLiquidityReserveWallet, address newStrategicPartnershipsWallet);
    event PresaleExtended(uint256 oldEndTime, uint256 newEndTime);
    event PresaleContractUpdated(address oldPresaleContract, address newPresaleContract);
    event KycStatusUpdated(address indexed user, bool status);

    /**
     * @dev Construtor do contrato
     * @param _developmentTeamWallet Carteira da equipe de desenvolvimento
     * @param _liquidityReserveWallet Carteira de reserva de liquidez
     * @param _strategicPartnershipsWallet Carteira de parcerias estratégicas
     * @param _deliveryOperator Operador responsável por confirmar entregas
     */
    constructor(
        address _developmentTeamWallet,
        address _liquidityReserveWallet,
        address _strategicPartnershipsWallet,
        address _deliveryOperator
    ) ERC20("Hanuman Water Token", "HWT") Ownable(msg.sender) {
        require(_developmentTeamWallet != address(0), "Development team wallet cannot be zero address");
        require(_liquidityReserveWallet != address(0), "Liquidity reserve wallet cannot be zero address");
        require(_strategicPartnershipsWallet != address(0), "Strategic partnerships wallet cannot be zero address");
        require(_deliveryOperator != address(0), "Delivery operator cannot be zero address");
        
        developmentTeamWallet = _developmentTeamWallet;
        liquidityReserveWallet = _liquidityReserveWallet;
        strategicPartnershipsWallet = _strategicPartnershipsWallet;
        deliveryOperator = _deliveryOperator;
        
        // Definir o fim da pré-venda para 1 ano a partir da implantação
        presaleEndTime = block.timestamp + MAX_PRESALE_DURATION;
    }
    
    /**
     * @dev Modificador para verificar se o endereço está aprovado no KYC
     */
    modifier onlyKycApproved(address _address) {
        require(kycApproved[_address], "Address not KYC approved");
        _;
    }
    
    /**
     * @dev Modificador para verificar se o contrato está em período de pré-venda
     */
    modifier duringPresale() {
        require(block.timestamp <= presaleEndTime, "Presale period has ended");
        _;
    }
    
    /**
     * @dev Modificador para verificar se o chamador é o contrato de pré-venda
     */
    modifier onlyPresaleContract() {
        require(msg.sender == presaleContractAddress, "Caller is not the presale contract");
        _;
    }
    
    /**
     * @dev Função para pausar o contrato (apenas owner)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Função para despausar o contrato (apenas owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Atualiza o endereço do contrato de pré-venda
     * @param _presaleContractAddress Novo endereço do contrato de pré-venda
     */
    function updatePresaleContract(address _presaleContractAddress) external onlyOwner {
        require(_presaleContractAddress != address(0), "Presale contract cannot be zero address");
        emit PresaleContractUpdated(presaleContractAddress, _presaleContractAddress);
        presaleContractAddress = _presaleContractAddress;
    }
    
    /**
     * @dev Atualiza o status KYC de um endereço
     * @param _address Endereço a ser atualizado
     * @param _status Novo status KYC
     */
    function updateKycStatus(address _address, bool _status) external onlyOwner {
        require(_address != address(0), "Address cannot be zero");
        kycApproved[_address] = _status;
        emit KycStatusUpdated(_address, _status);
    }
    
    // Limite máximo de endereços por lote para evitar ataques de negação de serviço
    uint256 public constant MAX_BATCH_SIZE = 100;
    
    /**
     * @dev Atualiza o status KYC de múltiplos endereços
     * @param _addresses Lista de endereços (limitado a MAX_BATCH_SIZE)
     * @param _status Status KYC a ser aplicado
     */
    function batchUpdateKycStatus(address[] calldata _addresses, bool _status) external onlyOwner {
        // Verificar se o tamanho do array não excede o limite
        require(_addresses.length <= MAX_BATCH_SIZE, "Batch size exceeds limit");
        
        // Processar cada endereço no lote
        for (uint256 i = 0; i < _addresses.length; i++) {
            kycApproved[_addresses[i]] = _status;
            emit KycStatusUpdated(_addresses[i], _status);
        }
    }

    /**
     * @dev Emite tokens durante o período de pré-venda
     * @param to Endereço do destinatário
     * @param amount Quantidade de tokens a serem emitidos
     */
    function mintPresaleTokens(address to, uint256 amount) 
        external 
        onlyPresaleContract 
        duringPresale 
        whenNotPaused 
        nonReentrant 
    {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than zero");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        
        // Verificar se não excede a alocação pública
        require(totalPublicAllocation + amount <= MAX_PUBLIC_ALLOCATION, "Exceeds public allocation");
        
        totalPublicAllocation += amount;
        _mint(to, amount);
    }
    
    /**
     * @dev Emite tokens para a equipe de desenvolvimento
     * @param amount Quantidade de tokens a serem emitidos
     */
    function mintTeamTokens(uint256 amount) external onlyOwner whenNotPaused nonReentrant {
        require(amount > 0, "Amount must be greater than zero");
        require(totalTeamAllocation + amount <= MAX_TEAM_ALLOCATION, "Exceeds team allocation");
        
        totalTeamAllocation += amount;
        _mint(developmentTeamWallet, amount);
    }
    
    /**
     * @dev Emite tokens para o fundo de liquidez
     * @param amount Quantidade de tokens a serem emitidos
     */
    function mintLiquidityTokens(uint256 amount) external onlyOwner whenNotPaused nonReentrant {
        require(amount > 0, "Amount must be greater than zero");
        require(totalLiquidityAllocation + amount <= MAX_LIQUIDITY_ALLOCATION, "Exceeds liquidity allocation");
        
        totalLiquidityAllocation += amount;
        _mint(liquidityReserveWallet, amount);
    }
    
    /**
     * @dev Emite tokens para parcerias estratégicas
     * @param amount Quantidade de tokens a serem emitidos
     */
    function mintPartnershipsTokens(uint256 amount) external onlyOwner whenNotPaused nonReentrant {
        require(amount > 0, "Amount must be greater than zero");
        require(totalPartnershipsAllocation + amount <= MAX_PARTNERSHIPS_ALLOCATION, "Exceeds partnerships allocation");
        
        totalPartnershipsAllocation += amount;
        _mint(strategicPartnershipsWallet, amount);
    }
    
    /**
     * @dev Emite tokens para recompensas à comunidade
     * @param to Endereço do destinatário
     * @param amount Quantidade de tokens a serem emitidos
     */
    function mintCommunityTokens(address to, uint256 amount) external onlyOwner whenNotPaused nonReentrant {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than zero");
        require(totalCommunityAllocation + amount <= MAX_COMMUNITY_ALLOCATION, "Exceeds community allocation");
        
        totalCommunityAllocation += amount;
        _mint(to, amount);
    }
    
    /**
     * @dev Emite tokens para consultores e vendas
     * @param to Endereço do destinatário
     * @param amount Quantidade de tokens a serem emitidos
     */
    function mintConsultantsTokens(address to, uint256 amount) external onlyOwner whenNotPaused nonReentrant {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than zero");
        require(totalConsultantsAllocation + amount <= MAX_CONSULTANTS_ALLOCATION, "Exceeds consultants allocation");
        
        totalConsultantsAllocation += amount;
        _mint(to, amount);
    }

    /**
     * @dev Registra uma compra de tokens (para compras off-chain)
     * @param buyer Endereço do comprador
     * @param amount Quantidade de tokens comprados
     * @param paymentMethod Método de pagamento utilizado
     */
    function recordPurchase(address buyer, uint256 amount, string calldata paymentMethod) 
        external 
        onlyOwner 
        duringPresale 
        whenNotPaused 
        nonReentrant 
    {
        require(buyer != address(0), "Buyer cannot be zero address");
        require(amount > 0, "Amount must be greater than zero");
        
        emit TokensPurchased(buyer, amount, paymentMethod);
    }

    /**
     * @dev Modificador para verificar se o chamador é o operador de entrega
     */
    modifier onlyDeliveryOperator() {
        require(msg.sender == deliveryOperator, "Caller is not the delivery operator");
        _;
    }
    
    /**
     * @dev Atualiza o endereço do operador de entrega
     * @param _newDeliveryOperator Novo endereço do operador de entrega
     */
    function updateDeliveryOperator(address _newDeliveryOperator) external onlyOwner {
        require(_newDeliveryOperator != address(0), "Delivery operator cannot be zero address");
        deliveryOperator = _newDeliveryOperator;
    }
    
    /**
     * @dev Atualiza o período de expiração para resgates
     * @param _newPeriod Novo período em segundos
     */
    function updateRedemptionExpiryPeriod(uint256 _newPeriod) external onlyOwner {
        require(_newPeriod >= 7 days, "Period must be at least 7 days");
        redemptionExpiryPeriod = _newPeriod;
    }
    
    /**
     * @dev Permite que um usuário solicite o resgate de água
     * @param amount Quantidade de tokens a serem reservados para resgate
     * @param deliveryDetails Detalhes para entrega (endereço, contato, etc.)
     * @notice Requer aprovação KYC para resgate físico
     * @return redemptionId ID único do resgate solicitado
     */
    function requestWaterRedemption(uint256 amount, string calldata deliveryDetails) 
        external 
        whenNotPaused 
        nonReentrant 
        onlyKycApproved(msg.sender) 
        returns (uint256 redemptionId)
    {
        require(amount >= MIN_REDEMPTION_AMOUNT, "Amount below minimum redemption");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(bytes(deliveryDetails).length > 0, "Delivery details required");
        
        // Reservar o ID do resgate
        redemptionId = nextRedemptionId;
        nextRedemptionId++;
        
        // Queimar os tokens
        _burn(msg.sender, amount);
        
        // Registrar o resgate
        waterRedemptions[redemptionId] = WaterRedemption({
            redeemer: msg.sender,
            amount: amount,
            requestTime: block.timestamp,
            expiryTime: block.timestamp + redemptionExpiryPeriod,
            delivered: false,
            cancelled: false,
            refunded: false,
            deliveryDetails: deliveryDetails
        });
        
        // Emitir evento de resgate
        emit WaterRedeemed(msg.sender, amount, amount, redemptionId);
        
        return redemptionId;
    }
    
    /**
     * @dev Permite que o operador confirme a entrega de água
     * @param redemptionId ID do resgate a ser confirmado
     */
    function confirmWaterDelivery(uint256 redemptionId) 
        external 
        whenNotPaused 
        nonReentrant 
        onlyDeliveryOperator 
    {
        WaterRedemption storage redemption = waterRedemptions[redemptionId];
        
        require(redemption.redeemer != address(0), "Redemption does not exist");
        require(!redemption.delivered, "Redemption already confirmed");
        require(!redemption.cancelled, "Redemption was cancelled");
        require(!redemption.refunded, "Redemption was refunded");
        require(block.timestamp <= redemption.expiryTime, "Redemption expired");
        
        // Marcar como entregue
        redemption.delivered = true;
        
        // Emitir evento de confirmação
        emit WaterRedemptionConfirmed(redemptionId, redemption.redeemer, redemption.amount);
    }
    
    /**
     * @dev Permite que o operador cancele um resgate (por exemplo, se a entrega for impossível)
     * @param redemptionId ID do resgate a ser cancelado
     * @param reason Motivo do cancelamento
     */
    function cancelWaterRedemption(uint256 redemptionId, string calldata reason) 
        external 
        whenNotPaused 
        nonReentrant 
        onlyDeliveryOperator 
    {
        WaterRedemption storage redemption = waterRedemptions[redemptionId];
        
        require(redemption.redeemer != address(0), "Redemption does not exist");
        require(!redemption.delivered, "Redemption already confirmed");
        require(!redemption.cancelled, "Redemption already cancelled");
        require(!redemption.refunded, "Redemption already refunded");
        
        // Marcar como cancelado
        redemption.cancelled = true;
        
        // Emitir evento de cancelamento
        emit WaterRedemptionCancelled(redemptionId, redemption.redeemer, redemption.amount, reason);
    }
    
    /**
     * @dev Permite que o usuário solicite reembolso de um resgate cancelado ou expirado
     * @param redemptionId ID do resgate a ser reembolsado
     */
    function refundWaterRedemption(uint256 redemptionId) 
        external 
        whenNotPaused 
        nonReentrant 
    {
        WaterRedemption storage redemption = waterRedemptions[redemptionId];
        
        require(redemption.redeemer == msg.sender, "Not the redeemer");
        require(!redemption.delivered, "Redemption already confirmed");
        require(!redemption.refunded, "Already refunded");
        require(redemption.cancelled || block.timestamp > redemption.expiryTime, "Can only refund cancelled or expired redemptions");
        
        // Marcar como reembolsado
        redemption.refunded = true;
        
        // Reemitir os tokens para o usuário
        _mint(redemption.redeemer, redemption.amount);
        
        // Emitir evento de reembolso
        emit WaterRedemptionRefunded(redemptionId, redemption.redeemer, redemption.amount);
    }
    
    /**
     * @dev Permite que um usuário verifique o status de um resgate
     * @param redemptionId ID do resgate a ser verificado
     * @return redeemer Endereço do solicitante
     * @return amount Quantidade de tokens
     * @return requestTime Timestamp da solicitação
     * @return expiryTime Timestamp de expiração
     * @return delivered Status de entrega
     * @return cancelled Status de cancelamento
     * @return refunded Status de reembolso
     */
    function getWaterRedemptionStatus(uint256 redemptionId) 
        external 
        view 
        returns (
            address redeemer,
            uint256 amount,
            uint256 requestTime,
            uint256 expiryTime,
            bool delivered,
            bool cancelled,
            bool refunded
        ) 
    {
        WaterRedemption storage redemption = waterRedemptions[redemptionId];
        require(redemption.redeemer != address(0), "Redemption does not exist");
        
        return (
            redemption.redeemer,
            redemption.amount,
            redemption.requestTime,
            redemption.expiryTime,
            redemption.delivered,
            redemption.cancelled,
            redemption.refunded
        );
    }

    /**
     * @dev Atualiza os endereços das carteiras administrativas
     * @param _developmentTeamWallet Nova carteira da equipe de desenvolvimento
     * @param _liquidityReserveWallet Nova carteira de reserva de liquidez
     * @param _strategicPartnershipsWallet Nova carteira de parcerias estratégicas
     */
    function updateWallets(
        address _developmentTeamWallet,
        address _liquidityReserveWallet,
        address _strategicPartnershipsWallet
    ) external onlyOwner {
        require(_developmentTeamWallet != address(0), "Development team wallet cannot be zero address");
        require(_liquidityReserveWallet != address(0), "Liquidity reserve wallet cannot be zero address");
        require(_strategicPartnershipsWallet != address(0), "Strategic partnerships wallet cannot be zero address");
        
        developmentTeamWallet = _developmentTeamWallet;
        liquidityReserveWallet = _liquidityReserveWallet;
        strategicPartnershipsWallet = _strategicPartnershipsWallet;
        
        emit WalletsUpdated(_developmentTeamWallet, _liquidityReserveWallet, _strategicPartnershipsWallet);
    }

    /**
     * @dev Estende o período de pré-venda, limitado a 1 ano a partir da implantação
     * @param _newEndTime Novo timestamp de fim da pré-venda
     */
    function extendPresale(uint256 _newEndTime) external onlyOwner {
        require(_newEndTime > presaleEndTime, "New end time must be later than current");
        
        // Calcular o limite máximo permitido para a extensão
        uint256 maxAllowedEndTime = block.timestamp + MAX_PRESALE_DURATION;
        
        // Verificar se a nova data está dentro do limite máximo
        require(_newEndTime <= maxAllowedEndTime, "Cannot extend beyond maximum presale duration");
        
        // Verificar se ainda há tokens disponíveis para venda
        require(totalPublicAllocation < TOTAL_PRESALE_TOKENS, "All presale tokens have been sold");
        
        uint256 oldEndTime = presaleEndTime;
        presaleEndTime = _newEndTime;
        
        emit PresaleExtended(oldEndTime, _newEndTime);
    }
    
    /**
     * @dev Sobrescreve a função _update para implementar pausabilidade
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override whenNotPaused {
        super._update(from, to, amount);
    }
}
