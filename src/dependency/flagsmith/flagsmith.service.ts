import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Flagsmith from 'flagsmith-nodejs/build/sdk';
// import Flagsmith from 'flagsmith-nodejs';
@Injectable()
export class FlagsmitService {
  constructor(private configService: ConfigService) {}
  private flagsmith: Flagsmith;
  public flags: any;
  public identifier: string = '';
  async init() {
    this.flagsmith = new Flagsmith({
      environmentKey: this.configService.get<string>('flagSmithKey'),
    });
    await this.getEnvironmentFlags();
  }

  public async getEnvironmentFlags() {
    this.flags = await this.flagsmith.getEnvironmentFlags();
    console.log('running getEnvironmentFlags');
  }
  public async getIdentityFlags() {
    // this.flags = await this.flagsmith.getIdentityFlags(this.identifier);
    this.flags = await this.flagsmith.getIdentityFlags('rte');
    console.log('running getIdentityFlags');
  }

  public async refreshFlags() {
    if (this.identifier == '') {
      await this.getEnvironmentFlags();
      return 'Get the environment flags successfully';
    } else if (this.identifier != '') {
      await this.getIdentityFlags();
      return 'Get the indentity flags successfully';
    }
  }
  public async activateIdentity(identifier: string) {
    this.identifier = identifier;
    await this.refreshFlags();
    return 'Activate the indentifier successfully';
  }
  public async deactivateIdentity() {
    this.identifier = '';
    await this.refreshFlags();
    return 'Deactivate the indentifier successfully';
  }
}
