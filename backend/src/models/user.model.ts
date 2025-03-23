import {
  AutoIncrement,
  Column,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Workspace } from './workspace.model';

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
  @HasOne(() => Workspace, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  workspace: Workspace;
}
