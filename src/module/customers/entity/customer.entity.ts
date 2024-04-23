// users.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn, OneToMany, ManyToMany } from "typeorm";

@Entity({ name: "customers" })
export class CustomersEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    email: string;

    @Column({ type: "varchar" })
    phone_number: string;

    @Column({ type: 'varchar' })
    customer_internal_id: string

    @Column({ type: 'bool' })
    is_active: boolean
 
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}
