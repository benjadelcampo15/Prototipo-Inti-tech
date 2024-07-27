import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Stats } from './stats.entity';
import { Pvsyst } from './pvsyst.entity';

@Entity({ name: 'panel' })
export class Panel {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  name: string;

  @Column()
  inversor: string;

  @Column()
  logo: string;

  @Column()
  address: string;

  @OneToMany(() => Stats, (stat) => stat.panel)
  @JoinColumn()
  stats: Stats[];

  @OneToMany(() => Pvsyst, (pvsyst) => pvsyst.panel)
  @JoinColumn()
  pvsyst: Pvsyst[];
}
