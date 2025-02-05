import type { AddressLike } from '@enzymefinance/ethers';
import type { ComptrollerLib } from '@enzymefinance/protocol';
import type { SignerWithAddress } from '@enzymefinance/testutils';
import type { BigNumberish, BytesLike } from 'ethers';

export async function callOnExtension({
  comptrollerProxy,
  extension,
  actionId,
  callArgs = '0x',
  signer,
}: {
  comptrollerProxy: ComptrollerLib;
  extension: AddressLike;
  actionId: BigNumberish;
  callArgs?: BytesLike;
  signer?: SignerWithAddress;
}) {
  let callOnExtensionTx: any;

  if (signer) {
    callOnExtensionTx = comptrollerProxy.connect(signer).callOnExtension(extension, actionId, callArgs);
  } else {
    callOnExtensionTx = comptrollerProxy.callOnExtension(extension, actionId, callArgs);
  }

  await expect(callOnExtensionTx);

  return callOnExtensionTx;
}
