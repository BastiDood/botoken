// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/utils/math/SignedMath.sol';
import '@openzeppelin/contracts/utils/structs/EnumerableSet.sol';

contract Botoken is ERC20('Botoken', 'BTK'), Ownable(msg.sender) {
    using EnumerableSet for EnumerableSet.AddressSet;

    event Creation(address indexed author, string title, uint stake);
    event Vote(address indexed author, address indexed voter, int balance);
    event Close(address indexed author, int balance);

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
        int _balance;
    }

    /** Mapping from authors to their created polls. */
    mapping(address => Poll) _polls;

    modifier validPoll(address _author) {
        require(_polls[_author]._pot > 0, 'poll does not exist');
        _;
    }

    modifier vacantPoll(address _author) {
        require(_polls[_author]._pot == 0, 'poll already exists');
        _;
    }

    modifier nonOwner() {
        require(_msgSender() != owner(), 'cannot be invoked by owner');
        _;
    }

    constructor(uint _supply) {
        // Voting power is a zero-sum game!
        _mint(address(this), _supply);
    }

    function title(address _author) public view validPoll(_author) returns (string memory) {
        return _polls[_author]._title;
    }

    function pot(address _author) public view validPoll(_author) returns (uint) {
        return _polls[_author]._pot;
    }

    function balance(address _author) public view validPoll(_author) returns (int) {
        return _polls[_author]._balance;
    }

    function createPoll(string memory _title, uint _stake) public vacantPoll(_msgSender()) nonOwner {
        address _author = _msgSender();
        Poll storage _poll = _polls[_author];
        _poll._title = _title;
        _poll._pot = _stake;
        _transfer(_author, address(this), _stake);
        emit Creation(_author, _title, _stake);
    }

    function voteOn(address _author, int _vote) public validPoll(_author) nonOwner {
        // Sway the vote balance (positive or negative)
        address _sender = _msgSender();
        Poll storage _poll = _polls[_author];
        _poll._balance += _vote;
        _poll._voters.add(_sender);

        // Contribute to the poll-level pot
        uint _amount = SignedMath.abs(_vote);
        _poll._pot += _amount;
        _transfer(_sender, address(this), _amount);
        emit Vote(_author, _sender, _poll._balance);
    }

    function closePoll(address _author) public validPoll(_author) onlyOwner returns (int) {
        Poll storage _poll = _polls[_author];

        address[] memory _voters = _poll._voters.values();
        uint _count = _voters.length;
        uint _share = _poll._pot / (_count + 1);

        // Evenly redistribute the voting power
        releaseResidual(_author, _share);
        for (uint i = 0; i < _count; ++i) releaseResidual(_voters[i], _share);

        int _balance = _poll._balance;
        emit Close(_author, _balance);

        // NOTE: Residual tokens are kept by the contract.
        delete _polls[_author];
        return _balance;
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
