// variant.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProductEntity } from '../../products/entities/product.entity';

@Entity({ name: 'variants' })
export class VariantEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'varchar', length: 20 })
    price: string;

    @Column({ type: 'int' })
    stock_quantity: number;

    @Column({ type: 'varchar', length: 255 })
    variant_internal_id: string;

    @Column({ type: 'varchar', length: 255 })
    r_series_system_id: string;

    @Column({ type: 'boolean' })
    is_active: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Column({ type: "int" })
    internal_id: number
    
    @Column({ type: 'varchar', length: 255 })
    internal_variant_id_to: string;

}

