import {
  AutoIncrement,
  BelongsToMany,
  Column,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Workspace } from './workspace.model';
import { Pages } from './pages.model';
import { WorkspaceMembers } from './workspace-members.model';
import { Invitations } from './invitations.model';

@Table
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  User_id: number;

  @Column
  email: string;

  @Column
  name: string;

  @Column
  password_hash: string;

  @Column
  storage_limit: number;

  @Column
  storage: number;

  @HasOne(() => Workspace)
  workspace: Workspace;

  @BelongsToMany(() => Pages, () => WorkspaceMembers)
  pages: Pages[];

  @HasMany(() => Invitations, 'invited_by')
  sentInvitations: Invitations[];
}
