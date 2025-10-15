import { Injectable } from '@nestjs/common';
import { Signature, verifyMessage } from 'viem';

@Injectable()
export class WalletService {
  async verifySignature(
    address: `0x${string}`,
    message: string,
    signature: Signature,
  ): Promise<boolean> {
    try {
      const ok = await verifyMessage({ address, message, signature });
      return ok;
    } catch (err) {
      return false;
    }
  }
}
