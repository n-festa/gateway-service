import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Flagsmith from 'flagsmith-nodejs/build/sdk';
// import Flagsmith from 'flagsmith-nodejs';
@Injectable()
export class FlagsmitService {
  constructor(
    private configService: ConfigService,
    private readonly restaurantClient: ClientProxy,
  ) {}
  private flagsmith: Flagsmith;
  private flags: any;
  private identifier: string = '';

  async init() {
    this.flagsmith = new Flagsmith({
      environmentKey: this.configService.get<string>('flagSmithKey'),
    });
    this.flags = await this.flagsmith.getEnvironmentFlags();

    //Edit all of the micro-services
    this.emitAllMicroServices();
  }

  private emitAllMicroServices() {
    this.restaurantClient.emit('refresh_flags', this.identifier);
  }

  public async refreshFlags() {
    let mess = '';
    if (this.identifier == '') {
      this.flags = await this.flagsmith.getEnvironmentFlags();
      mess = 'Get the environment flags successfully';
    } else if (this.identifier != '') {
      this.flags = await this.flagsmith.getIdentityFlags(this.identifier);
      mess = 'Get the indentity flags successfully';
    }
    //Edit all of the micro-services
    this.emitAllMicroServices();
    return mess;
  }
  public async activateIdentity(identifier: string) {
    this.identifier = identifier;
    await this.refreshFlags();
    return 'Activate the identifier successfully';
  }
  public async deactivateIdentity() {
    this.identifier = '';
    await this.refreshFlags();
    return 'Deactivate the identifier successfully';
  }
  public getFlags() {
    return this.flags;
  }
}
