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
import { Pages } from './pages.model';

@Table
export class Blocks extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  Block_id: number;

  @Column
  type: string;

  @Column({
    type: DataType.JSONB,
    defaultValue: {},
  })
  content: Record<string, any>;

  @Column
  position: number;

  @ForeignKey(() => Pages)
  @Column
  page_id: number;

  @BelongsTo(() => Pages, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  page: Pages;
}
