import { Mutation } from '@nestjs/graphql';
import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { EmailFiltersArgs, UpdateEmail, UserEmail } from './email.types';
import { User } from '../user/user.types';
import { EmailService } from './email.service';
import { EmailId } from './email.interfaces';
import { Equal, FindOptionsWhere, In, Repository } from 'typeorm';
import { EmailEntity } from './email.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';

@Resolver(() => UserEmail)
export class EmailResolver {
  constructor(
    private readonly _service: EmailService,
    private readonly _userservice: UserService,
    @InjectRepository(EmailEntity)
    private readonly emailRepository: Repository<EmailEntity>,
  ) {}

  @Query(() => UserEmail, { name: 'email' })
  getEmail(@Args({ name: 'emailId', type: () => ID }) emailId: EmailId) {
    return this._service.get(emailId);
  }

  @Query(() => [UserEmail], { name: 'emailsList' })
  async getEmails(@Args() filters: EmailFiltersArgs): Promise<UserEmail[]> {
    const where: FindOptionsWhere<EmailEntity> = {};

    if (filters.address) {
      if (!filters.address.in?.length && filters.address.equal) {
        where.address = Equal(filters.address.equal);
      }
      if (filters.address.in?.length > 0) {
        where.address = In([...filters.address.in, filters.address.equal]);
      }
    }

    return this.emailRepository.find({
      where,
      order: { address: 'asc' },
    });
  }

  @ResolveField(() => User, { name: 'user' })
  async getUser(@Parent() parent: UserEmail): Promise<User> {
    return this._userservice.get(parent.userId);
  }

  @Mutation(() => ID)
  updateEmail(@Args() { id, address }: UpdateEmail): Promise<EmailId> {
    return this._service.update(id, address);
  }
}
