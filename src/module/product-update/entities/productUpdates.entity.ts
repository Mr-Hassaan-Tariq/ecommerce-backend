
import { PRODUCT_QUEUE_STATUS } from "src/constants/constants";
import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "products_update" })
export class ProductUpdateEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;


    @Column({ type: 'varchar' })
    title: string;

    @Column({ type: 'varchar', nullable: true })
    internal_id: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Column({ type: 'varchar', default: 0 })
    product_to: number

    @Column({ type: 'varchar', default: PRODUCT_QUEUE_STATUS.NEW })
    status: boolean

    @Column({ type: 'varchar', default: "" })
    message: string
}
