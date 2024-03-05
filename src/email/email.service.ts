import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { EmailEntity } from './email.entity';
import { EmailId, IEmail } from 'src/email/email.interfaces';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailEntity)
    private readonly emailRepository: Repository<EmailEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Récupère un email par rapport à un identifiant
   * @param id Identifiant de l'email à récupérer
   * @returns L'email correspondant à l'identifiant ou undefined
   */
  get(id: EmailId): Promise<IEmail> {
    return this.emailRepository.findOneBy({ id: Equal(id) });
  }

  /**
   * Modifie un email par rapport à un identifiant
   * @param emailId L'indentifiant de l'email à mofdifier
   * @param address La nouvelle addresse email
   * @returns L'identifiant de l'email modifié
   */
  async update(emailId: EmailId, address: string): Promise<EmailId> {
    const emailExist = await this.emailRepository.findOneBy({
      id: Equal(emailId),
    });

    if (!emailExist) {
      throw new NotFoundException(`L'email n'a pas été trouvé`);
    }

    const userDeactivated = await this.userRepository.exist({
      where: { id: Equal(emailExist.userId), status: 'inactive' },
    });

    if (userDeactivated) {
      throw new NotFoundException(
        `L'utilisateur est desactivé, modification impossible`,
      );
    }

    await this.emailRepository.update(
      { id: Equal(emailId) },
      { address: address },
    );

    return emailId;
  }
}
