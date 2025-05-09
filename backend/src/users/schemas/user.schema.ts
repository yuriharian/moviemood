import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true }) // O campo username é obrigatório e único
  username: string;

  @Prop({ required: true }) // O campo password é obrigatório
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
