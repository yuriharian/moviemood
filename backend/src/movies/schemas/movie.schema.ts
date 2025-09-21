import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Movie extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, min: 1, max: 10 })
  userRating: number;

  @Prop({ required: true })
  releaseYear: number;

  @Prop({ required: true })
  genre: string;

  @Prop({ default: false })
  favorite: boolean;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
