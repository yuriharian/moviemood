import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  director?: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  releaseYear?: number;

  @IsOptional()
  @IsString()
  genre?: string;
}
