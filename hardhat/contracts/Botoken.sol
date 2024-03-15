// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.24;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/utils/math/SignedMath.sol';
import '@openzeppelin/contracts/utils/structs/EnumerableSet.sol';

contract Botoken is ERC20('Botoken', 'BTK'), Ownable(msg.sender) {
    using EnumerableSet for EnumerableSet.AddressSet;

    error OwnerForbidden();
    error VacantPoll();
    error ExistingPoll();

    event Created(address indexed author, string title, uint stake);
    event Voted(address indexed author, address indexed voter, int balance);
    event Closed(address indexed author, string title, uint pot, int balance);

    struct Poll {
        string _title;
        /** Who to distribute tokens to? */
        EnumerableSet.AddressSet _voters;
        /** The total staked in the poll. */
        uint _pot;
        /**
         * Negative values mean "no". Positive values mean "yes".
         * @dev Possible future work is to introduce time-diminishing voting power?
         */
        int _consensus;
    }

    struct Final {
        string _title;
        uint _pot;
        int _consensus;
    }

    /** Mapping from authors to their created polls. */
    mapping(address => Poll) _polls;

    /** Append-only log of finalized polls. */
    Final[] _finals;

    modifier validPoll(address _author) {
        if (_polls[_author]._pot == 0) revert VacantPoll();
        _;
    }

    modifier vacantPoll(address _author) {
        if (_polls[_author]._pot > 0) revert ExistingPoll();
        _;
    }

    modifier nonOwner() {
        if (_msgSender() == owner()) revert OwnerForbidden();
        _;
    }

    constructor(uint _supply) {
        // Voting power is a zero-sum game!
        _mint(address(this), _supply);
    }

    function as_final(address _author) public view validPoll(_author) returns (Final memory) {
        Poll storage _poll = _polls[_author];
        return Final(_poll._title, _poll._pot, _poll._consensus);
    }

    function finals() public view returns (Final[] memory output) {
        return _finals;
    }

    function createPoll(string memory _title, uint _stake) public vacantPoll(_msgSender()) nonOwner {
        address _author = _msgSender();
        Poll storage _poll = _polls[_author];
        _poll._title = _title;
        _poll._pot = _stake;
        _transfer(_author, address(this), _stake);
        emit Created(_author, _title, _stake);
    }

    function voteOn(address _author, int _vote) public validPoll(_author) nonOwner {
        // Sway the vote balance (positive or negative)
        address _sender = _msgSender();
        Poll storage _poll = _polls[_author];
        _poll._consensus += _vote;
        _poll._voters.add(_sender);

        // Contribute to the poll-level pot
        uint _amount = SignedMath.abs(_vote);
        _poll._pot += _amount;
        _transfer(_sender, address(this), _amount);
        emit Voted(_author, _sender, _poll._consensus);
    }

    function closePoll(address _author) public validPoll(_author) onlyOwner returns (int) {
        Poll storage _poll = _polls[_author];

        string storage _title = _poll._title;
        uint _pot = _poll._pot;
        address[] memory _voters = _poll._voters.values();
        uint _count = _voters.length;
        uint _share = _pot / (_count + 1);

        // Evenly redistribute the voting power
        releaseResidual(_author, _share);
        for (uint i = 0; i < _count; ++i) releaseResidual(_voters[i], _share);

        // NOTE: Residual tokens are kept by the contract.
        int _consensus = _poll._consensus;
        emit Closed(_author, _title, _pot, _consensus);

        // Move the poll to finalized polls
        delete _polls[_author];
        _finals.push(Final(_title, _pot, _consensus));

        return _consensus;
    }

    /** @dev Inflationary measure for "air-dropping" voting power. */
    function mint(uint _supply) public onlyOwner {
        _mint(address(this), _supply);
    }

    /** Move tokens from the `msg.sender` into the contract. */
    function storeResidual(uint _amount) public onlyOwner {
        _transfer(_msgSender(), address(this), _amount);
    }

    /** Move tokens from the contract into some `target`. */
    function releaseResidual(address _target, uint _amount) public onlyOwner {
        _transfer(address(this), _target, _amount);
    }
}
