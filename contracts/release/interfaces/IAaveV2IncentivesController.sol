// SPDX-License-Identifier: GPL-3.0

/*
    This file is part of the Enzyme Protocol.

    (c) Enzyme Council <council@enzyme.finance>

    For the full license information, please view the LICENSE
    file that was distributed with this source code.
*/

pragma solidity 0.6.12;

/// @title IAaveV2IncentivesController interface
/// @author Enzyme Council <security@enzyme.finance>
interface IAaveV2IncentivesController {
    function claimRewards(
        address[] memory _assets,
        uint256 _amount,
        address _to
    ) external;
}
