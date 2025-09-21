import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/moviemood'), // Conexão com o MongoDB
    UsersModule,
    AuthModule,
    MoviesModule,
  ],
})
export class AppModule {}
