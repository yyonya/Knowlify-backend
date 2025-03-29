import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Pages } from './pages.model';
import { User } from './user.model';

@Table
export class Invitations extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  invite_id: number;

  @Column
  invite_email: string;

  @Column
  role: string;

  @Column
  status: string;

  @Column
  token: string;

  @Column
  expires_at: Date;

  @ForeignKey(() => Pages)
  @Column
  page_id: number;

  @ForeignKey(() => User)
  @Column
  invited_by: number;

  @BelongsTo(() => Pages, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  page: Pages;

  @BelongsTo(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'invited_by',
  })
  inviter: User;
}
