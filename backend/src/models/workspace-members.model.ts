import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Pages } from './pages.model';

@Table
export class WorkspaceMembers extends Model {
  @Column
  role: string;

  @PrimaryKey
  @ForeignKey(() => User)
  @Column
  user_id: number;

  @PrimaryKey
  @ForeignKey(() => Pages)
  @Column
  page_id: number;

  @BelongsTo(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @BelongsTo(() => Pages, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  page: Pages;
}
