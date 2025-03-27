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
  @Column({
    unique: true,
  })
  user_id: number;
  @BelongsTo(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;
}
