
import { BaseEntity, Column, Entity,  PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "products_category" })
export class ProductCategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    title: string;

    @Column({ type: 'int', nullable: true })
    internal_id: number

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;

    @Column({ type: 'int',default:0 })
    category_to: number


}
