import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { WalletService } from './wallet.service';
import type { Signature } from 'viem';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('verify')
  async verifySignature(
    @Body('address') address: `0x${string}`,
    @Body('message') message: string,
    @Body('signature') signature: Signature,
  ) {
    const verified = await this.walletService.verifySignature(
      address,
      message,
      signature,
    );

    if (!verified) {
      throw new UnauthorizedException('Signature invalid');
    }

    return { verified: true };
  }
}
