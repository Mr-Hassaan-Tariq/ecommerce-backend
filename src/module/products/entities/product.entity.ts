import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "products" })
export class ProductEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    title: string;

    @Column({ type: 'int', nullable: true })
    internal_id: number

    @Column({ type: 'varchar' })
    image: string

    @Column({ type: 'varchar' })
    thumbnail: string

    @Column({ type: 'bool' })
    is_active: boolean

    @Column({ type: 'bool',default:false })
    is_deleted: boolean


    @Column({ type: 'bool' })
    visibility: boolean

    @Column({ type: 'bool' })
    is_saved: boolean

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @JoinColumn({ name: 'category_id' })
    category_id: number

    @Column({ type: 'varchar' })
    price: string

    @Column({ type: 'int' })
    quantity: number

    @Column({ type: 'varchar' })
    c_series_name: string
    
    @Column({ type: 'int',default:0 })
    product_to: number


}
