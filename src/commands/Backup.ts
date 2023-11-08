import { suport_role_id } from '../utils/rolesId';
import { userHasRole } from '../utils/userHasRole';
import { requestBackupStart } from '../utils/requestBackupStart';

export class Backup {
  async startBackup(interaction: any) {
    const allowedUser = userHasRole({
      userId: interaction.user.id,
      roleId: suport_role_id,
    });

    if (!allowedUser) {
      return interaction.reply(
        'Você não tem permissão para executar esse comando',
      );
    }

    const response = await requestBackupStart();

    if (response.err) {
      const error: any = response.err;
      return interaction.reply(error.response.data.message);
    }

    return interaction.reply(response.data.message);
  }
}
