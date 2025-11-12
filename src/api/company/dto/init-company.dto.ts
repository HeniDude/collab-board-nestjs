import { IsString, Length, Matches } from 'class-validator';

export class InitCompanyDto {
  @IsString({ message: 'Название компании должно быть строкой' })
  @Length(2, 50, { message: 'Название компании должно быть от 2 до 50 символов' })
  @Matches(/^[A-Za-z0-9А-Яа-яёЁ _-]+$/, {
    message: 'Название компании может содержать только буквы, цифры, пробелы и символы "_-"',
  })
  name: string;
}
