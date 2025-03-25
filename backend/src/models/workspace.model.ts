import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class Workspace extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  Workspace_id: number;
  @Column
  name: string;
  @ForeignKey(() => User)
  @Column
  user_id: number;
  @BelongsTo(() => User)
  user: User;
}
