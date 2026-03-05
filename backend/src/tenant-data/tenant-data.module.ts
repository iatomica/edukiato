import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { TenantDataController } from './tenant-data.controller';
import { TenantDataService } from './tenant-data.service';

@Module({
    imports: [DbModule],
    controllers: [TenantDataController],
    providers: [TenantDataService],
})
export class TenantDataModule {}
