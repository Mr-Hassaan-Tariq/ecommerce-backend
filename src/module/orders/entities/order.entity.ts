// order.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, } from 'typeorm';
@Entity({ name: 'orders' })
export class OrderEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    order_date: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
    total_amount: string;

    @Column({ default: false })
    is_completed: boolean;

    @Column({ type: "varchar" })
    status: string

    @Column({ type: 'varchar' })
    order_internal_id: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_date: Date;

    @Column({ type: "varchar", nullable: true })
    sale_internal_id: string
}