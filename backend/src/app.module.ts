import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [AuthModule, CoursesModule, InstitutionsModule, UsersModule],
})
export class AppModule { }
