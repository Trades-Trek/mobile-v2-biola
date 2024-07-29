import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToOne} from "typeorm";
import {Company} from "./companies.entity";
import {Exchange} from "./exchange.entity";

@Entity('stock_prices')
export class StockPrice {
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false, type:'unsigned big int', name:'company_id'})
    company_id:number

    @Column({nullable:false, type:'varchar'})
    csi:number

    @Column({type:'varchar', nullable:false})
    symbol:string

    @Column({type:'varchar', nullable:false})
    currency:string

    @Column({type:'decimal',nullable:true})
    last:number

    @Column({type:'datetime', nullable:true})
    last_trade_time:Date

    @Column({type:'decimal', nullable:true})
    ask:number

    @Column({type:'int', nullable:true})
    bid:number

    @Column({type:'int', nullable:true})
    ask_size:number

    @Column({type:'int', nullable:true})
    bid_size:number

    @Column({type:'decimal', nullable:true})
    prev_close:number


    @Column({type:'date', nullable:true})
    prev_close_date:Date

    @Column({type:'decimal', nullable:true})
    change:number

    @Column({type:'decimal', nullable:true})
    per_change:number
    @Column({type:'decimal', nullable:true})
    open:number

    @Column({type:'decimal', nullable:true})
    high:number

    @Column({type:'decimal', nullable:true})
    low:number

    @Column({type:'decimal', nullable:true})
    close:number

    @Column({type:'decimal', nullable:true})
    eps:number

    @Column({type:'decimal', nullable:true})
    pe:number

    @Column({type:'bigint', nullable:true})
    volume:number

    @Column({type:'decimal', nullable:true})
    high_52_week:number

    @Column({type:'decimal', nullable:true})
    low_52_week:number

    @Column({type:'decimal', nullable:true})
    mkt_cap:number

    @Column({type:'date', nullable:true})
    trade_date:Date

    @Column({type:'int', nullable:false, default:0})
    request_number:number

    @Column({type:'timestamp', nullable:true})
    created_at:Date

    @Column({type:'timestamp', nullable:true})
    updated_at:Date

    @OneToOne(() => Company, (company) => company)
    @JoinColumn({name:'company_id'})
    company:Company

    // @ManyToOne(() => Exchange, (exchange) => exchange)
    // exchange:Exchange

}
