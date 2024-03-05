import { ArgsType, Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsOptional } from 'class-validator';
import { Maybe } from 'graphql/jsutils/Maybe';
import { EmailId, IEmail, IEmailFilters } from './email.interfaces';

@ObjectType()
export class UserEmail implements IEmail {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  address: string;

  userId: string;
}

@InputType()
export class StringFilters {
  @IsOptional()
  @Field(() => String, { nullable: true })
  equal: Maybe<string>;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  in: Maybe<string[]>;
}

@ArgsType()
export class EmailFiltersArgs implements IEmailFilters {
  @IsOptional()
  @Field(() => StringFilters, { nullable: true })
  address?: Maybe<StringFilters>;
}

@ArgsType()
export class UpdateEmail implements IEmail {
  @Field(() => ID)
  id: Maybe<EmailId>;

  @IsEmail({}, { message: 'This is not a valid email' })
  @Field(() => String)
  address: Maybe<string>;
}
