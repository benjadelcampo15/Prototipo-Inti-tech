import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Panel } from './panel.entity';

@Entity({ name: 'pvsyst' })
export class Pvsyst {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  month: number;

  @Column()
  year: number;

  @Column('float')
  estimatedGeneration: number;

  @ManyToOne(() => Panel, (panel) => panel.pvsyst)
  panel: Panel;
}
