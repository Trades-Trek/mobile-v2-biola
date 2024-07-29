import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('stock_news')
export class StockNews extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false, type: 'varchar'})
    url: string

    @Column({nullable: false, type: 'varchar'})
    title: string

    @Column({nullable: true, type: 'int'})
    read_min: number

    @Column({type: 'varchar', nullable: false})
    source_name: string

    @Column({type: 'varchar', nullable: false})
    category: number

    @Column({type: 'bigint', nullable: false})
    symbols: string

    @Column({type: 'tinyint', nullable: false})
    is_visible: boolean

    @Column({type: 'varchar', nullable: false})
    language: number

    @Column({type: 'varchar', nullable: false})
    geo_target: number

    @Column({type: 'varchar', nullable: true})
    author: string

    @Column({type: 'varchar', nullable: false})
    image_url: string

    @Column({type: 'text', nullable: false})
    summary: string

    @Column({type: 'int', nullable: false})
    views: number

    @Column({type: 'int', nullable: false})
    company_id: number

    @Column({type: 'timestamp', nullable: true})
    created_at: Date

    @Column({type: 'timestamp', nullable: true})
    updated_at: Date
}
