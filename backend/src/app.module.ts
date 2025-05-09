import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/moviemood'), // Conexão com o MongoDB
    UsersModule, // Importa o módulo de usuários
    AuthModule, // Importa o módulo de autenticação
    MoviesModule, // Importa o módulo de filmes
  ],
})
export class AppModule {}
