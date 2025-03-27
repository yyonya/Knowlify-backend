import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Workspace } from './workspace.model';

@Table
export class Pages extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  Page_id: number;

  @Column
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  parent_page_id: number | null;

  @Column
  depth: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  picture_url: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  avatar_url: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  type: string | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  is_public: boolean | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  category: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  subscription_type: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deletedAt: Date | null;

  @ForeignKey(() => Workspace)
  @Column
  workspace_id: number;

  @BelongsTo(() => Workspace, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  workspace: Workspace;
}
