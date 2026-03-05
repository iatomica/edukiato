import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { DbModule } from './db/db.module';
import { EventsModule } from './events/events.module';
import { TenantDataModule } from './tenant-data/tenant-data.module';
import { MessagesModule } from './messages/messages.module';

@Module({
    imports: [DbModule, AuthModule, CoursesModule, InstitutionsModule, UsersModule, ReportsModule, EventsModule, TenantDataModule, MessagesModule],
})
export class AppModule { }
