import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('exchanges')
export class Exchange extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false, type:'varchar'})
    name:string

    @Column({nullable:false, type:'varchar'})
    symbol:string

    @Column({type:'double', nullable:true})
    asi:string

    @Column({type:'int', nullable:true})
    deals:number

    @Column({type:'bigint', nullable:true})
    volume:string

    @Column({type:'double', nullable:true})
    value:number

    @Column({type:'double', nullable:true})
    cap:number

    @Column({type:'double', nullable:true})
    bond_cap:number

    @Column({type:'double', nullable:true})
    off_cap:string

    @Column({type:'datetime', nullable:false})
    open_time:Date

    @Column({type:'datetime', nullable:false})
    close_time:string


    @Column({type:'timestamp', nullable:true})
    created_at:Date

    @Column({type:'timestamp', nullable:true})
    updated_at:Date



}
