/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('system_configurations')
export class SystemConfiguration {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column()
    value: string;

    @Column()
    description: string;

    @Column('timestamp')
    created_at: Date;

    @Column('timestamp', { nullable: true })
    updated_at: Date;
}
