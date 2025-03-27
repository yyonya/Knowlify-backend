import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Pages } from './pages.model';

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

  @HasMany(() => Pages)
  pages: Pages[];

  @BelongsTo(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;
}
