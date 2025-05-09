import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Movie extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, min: 1, max: 10 }) // Nota do usuário entre 1 e 10
  userRating: number;

  @Prop({ required: true })
  releaseYear: number;

  @Prop({ required: true })
  genre: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
