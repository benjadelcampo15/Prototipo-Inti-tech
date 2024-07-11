import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Panel } from './panel.entity';

@Entity({ name: 'stats' })
export class Stats {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  day : number;

  @Column()
  month : number;

  @Column()
  year : number;

  @Column()
  energyGenerated : number;

  @ManyToOne(() => Panel, panel => panel.stats)
  panel: Panel;

}
