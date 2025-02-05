import type { AddressLike } from '@enzymefinance/ethers';
import { extractEvent } from '@enzymefinance/ethers';
import type { ComptrollerLib, ExternalPositionManager } from '@enzymefinance/protocol';
import {
  callOnExternalPositionArgs,
  encodeArgs,
  ExternalPositionManagerActionId,
  externalPositionReactivateArgs,
  externalPositionRemoveArgs,
  IExternalPositionProxy,
} from '@enzymefinance/protocol';
import type { SignerWithAddress } from '@enzymefinance/testutils';
import type { BigNumberish, BytesLike } from 'ethers';

export async function callOnExternalPosition({
  signer,
  comptrollerProxy,
  externalPositionManager,
  externalPositionProxy,
  actionId,
  actionArgs,
}: {
  signer: SignerWithAddress;
  comptrollerProxy: ComptrollerLib;
  externalPositionManager: ExternalPositionManager;
  externalPositionProxy: AddressLike;
  actionId: BigNumberish;
  actionArgs: BytesLike;
}) {
  const callArgs = callOnExternalPositionArgs({
    actionArgs,
    actionId,
    externalPositionProxy,
  });

  return comptrollerProxy
    .connect(signer)
    .callOnExtension.args(externalPositionManager, ExternalPositionManagerActionId.CallOnExternalPosition, callArgs)
    .gas(8000000)
    .send();
}

export async function createExternalPosition({
  signer,
  comptrollerProxy,
  externalPositionManager,
  externalPositionTypeId,
  initializationData = '0x',
  callOnExternalPositionData = '0x',
}: {
  signer: SignerWithAddress;
  comptrollerProxy: ComptrollerLib;
  externalPositionManager: ExternalPositionManager;
  externalPositionTypeId: BigNumberish;
  initializationData?: BytesLike;
  callOnExternalPositionData?: BytesLike;
}) {
  const receipt = await comptrollerProxy
    .connect(signer)
    .callOnExtension(
      externalPositionManager,
      ExternalPositionManagerActionId.CreateExternalPosition,
      encodeArgs(
        ['uint256', 'bytes', 'bytes'],
        [externalPositionTypeId, initializationData, callOnExternalPositionData],
      ),
    );

  const event = extractEvent(receipt, externalPositionManager.abi.getEvent('ExternalPositionDeployedForFund'));

  const externalPositionProxy = new IExternalPositionProxy(event[0].args.externalPosition, signer);

  return { externalPositionProxy, receipt };
}

export async function reactivateExternalPosition({
  signer,
  comptrollerProxy,
  externalPositionManager,
  externalPositionProxy,
}: {
  signer: SignerWithAddress;
  comptrollerProxy: ComptrollerLib;
  externalPositionManager: ExternalPositionManager;
  externalPositionProxy: AddressLike;
}) {
  const callArgs = externalPositionReactivateArgs({ externalPositionProxy });

  return comptrollerProxy
    .connect(signer)
    .callOnExtension(externalPositionManager, ExternalPositionManagerActionId.ReactivateExternalPosition, callArgs);
}

export async function removeExternalPosition({
  signer,
  comptrollerProxy,
  externalPositionManager,
  externalPositionProxy,
}: {
  signer: SignerWithAddress;
  comptrollerProxy: ComptrollerLib;
  externalPositionManager: ExternalPositionManager;
  externalPositionProxy: AddressLike;
}) {
  const callArgs = externalPositionRemoveArgs({ externalPositionProxy });

  return comptrollerProxy
    .connect(signer)
    .callOnExtension(externalPositionManager, ExternalPositionManagerActionId.RemoveExternalPosition, callArgs);
}
