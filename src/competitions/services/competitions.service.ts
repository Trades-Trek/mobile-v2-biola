import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {CreateCompetitionDto, JoinCompetitionDto, PortfolioDto} from '.././dto/create-competition.dto';
import {InjectModel} from "@nestjs/mongoose";
import {Competition, CompetitionDocument} from ".././schemas/competition.schema";
import {Model, Types} from "mongoose";
import {Pagination} from "../../enums/pagination.enum";
import {UserDocument} from "../../users/schemas/user.schema";
import {returnErrorResponse, successResponse} from "../../utils/response";
import {SUCCESS_MESSAGES} from "../../enums/success-messages";
import {ERROR_MESSAGES} from "../../enums/error-messages";
import {ConfigService} from "@nestjs/config";
import {COMPETITION_ENTRY, COMPETITION_STATUS, COMPETITION_TYPE} from "../../enums/competition.enum";
import {WalletService} from "../../wallet/wallet.service";
import {generateCode} from "../../utils/constant";
import {ActivitiesService} from "../../activities/activities.service";
import {ACTIVITY_ENTITY, ACTIVITY_MESSAGES} from "../../enums/activities.enum";
import {Participant, ParticipantDocument} from ".././schemas/participant.schema";
import {QueueService} from "../../queues/queue.service";
import {EMAIL_SUBJECTS} from "../../enums/emails.enum";
import {useOneSignalService} from "../../services/onesignal";
import {AccountValueService} from "./account-value.service";
import {OrdersService} from "../../orders/orders.service";
import {ORDER_STATUS} from "../../enums/orders.enum";
import {UpdateCompetitionDto} from "../dto/update-competition.dto";
import {AppSettingsService} from "../../app-settings/app-settings.service";
import {OrderQueryDto} from "../../orders/dto/create-order.dto";

const onesignalService = useOneSignalService()

@Injectable()
export class CompetitionsService {
    constructor(@InjectModel(Competition.name) private competitionModel: Model<Competition>, @InjectModel(Participant.name) private participantModel: Model<Participant>, private configService: ConfigService, private walletsService: WalletService, private activityService: ActivitiesService, private queueService: QueueService, private accountValueService: AccountValueService, @Inject(forwardRef(() => OrdersService)) private orderService: OrdersService, private appSettings: AppSettingsService) {
    }

    async create(user: UserDocument, createCompetitionDto: CreateCompetitionDto) {
        const {capacity, type, starting_cash, entry, participants, is_default} = createCompetitionDto;
        const {minStartingCash, maxStartingCash, capacityFee} = await this.getMinAndMaxStartingCash()
        // compare starting cash
        if (starting_cash < minStartingCash || starting_cash > maxStartingCash) returnErrorResponse(ERROR_MESSAGES.STARTING_CASH_ERROR)
        // check capacity
        if (type === COMPETITION_TYPE.GROUP && !is_default) {
            const capacityFeeToBeDebited = capacity * capacityFee
            if (capacityFeeToBeDebited > user.trek_coin_balance) {
                // show owner his trek coins balance capacity
                const yourTrekCoinsCapacity = user.trek_coin_balance / capacityFee;
                returnErrorResponse(`Sorry, your trek coins balance can only Solicit for ${yourTrekCoinsCapacity} capacity`)
            }
            // debit user trek coins
            await this.walletsService.debitUserTrekCoins(user, capacityFeeToBeDebited)
        }
        // create competition
        createCompetitionDto['owner'] = user.id
        if (entry === COMPETITION_ENTRY.CLOSED) {
            createCompetitionDto['password'] = generateCode(6)
        }
        const competition = await this.competitionModel.create(createCompetitionDto)
        await this.findOrCreateParticipant(competition.id, user.email, user.id)
        await this.joinCompetition(user, competition)
        // invite participants
        if (participants && participants.length && type === COMPETITION_TYPE.GROUP) {
            for (const email of participants) {
                const participant = await this.findOrCreateParticipant(competition.id, email)
                this.inviteParticipant(participant, competition, user)
            }
            // generate receipt for competition
        }
        // create activity
        this.activityService.create({
            activity: ACTIVITY_MESSAGES.CREATED_COMPETITION,
            by: user,
            entity: ACTIVITY_ENTITY.COMPETITION
        })
        return successResponse({competition, message: SUCCESS_MESSAGES.COMPETITION_CREATED})
    }

    async findAll(user: UserDocument, pagination: Pagination) {
        // retrieve competition
        let competitionsJoined = await this.participantModel.find({participant: user.id}).lean().populate('competition', 'name id description owner is_default').select('participant id competition').exec();
        let competitions = []
        if (competitionsJoined && competitionsJoined.length) {
            for (const c of competitionsJoined) {
                const {
                    cash_value,
                    account_value,
                    today_percentage_change,
                } = await this.portfolio({competition_id: c.competition._id}, user, true)
                c.competition['cash_value'] = cash_value;
                c.competition['account_value'] = account_value;
                c.competition['today_percentage_change'] = today_percentage_change
                competitions.push(c.competition)
            }
        }

        return successResponse({competitions})
    }


    async findOne(filter: {}): Promise<CompetitionDocument | undefined> {
        return this.competitionModel.findOne(filter)
    }

    async findOrCreateParticipant(competitionId: Types.ObjectId, participantEmail: string, ownerId: Types.ObjectId = null) {
        return await this.participantModel.findOne({
            email: participantEmail,
            competition: competitionId
        }) ?? await this.participantModel.create({
            participant: ownerId,
            competition: competitionId,
            email: participantEmail,
            is_owner: !!ownerId
        })
    }


    async joinCompetition(user: UserDocument, competition: CompetitionDocument): Promise<boolean> {
        const m = await this.participantModel.findOneAndUpdate({competition: competition.id, email: user.email}, {
            $set: {
                joined: true,
                participant: user.id,
                starting_cash: competition.starting_cash
            }
        },)
        if (!m) returnErrorResponse(ERROR_MESSAGES.COMPETITION_REQUEST_NOT_FOUND)
        await this.activityService.create({
            activity: ACTIVITY_MESSAGES.JOINED_COMPETITION,
            entity: ACTIVITY_ENTITY.COMPETITION,
            by: user
        })
        // send push notification to competition owner
        return true;
    }


    async remove(competitionId: Types.ObjectId, user: UserDocument, isAdmin: boolean = false) {
        const competition = !isAdmin ? await this.competitionModel.findOne({
            '_id': competitionId,
            owner: user.id
        }) : this.competitionModel.findOne({'_id': competitionId})
        if (!competition) returnErrorResponse(ERROR_MESSAGES.COMPETITION_NOT_FOUND)
        await competition.deleteOne()
        return successResponse(SUCCESS_MESSAGES.COMPETITION_DELETED)
    }

    async getMinAndMaxStartingCash(): Promise<{ minStartingCash: number, maxStartingCash: number, capacityFee: number }> {
        const {MAX_STARTING_CASH, MIN_STARTING_CASH, CAPACITY_FEE} = await this.appSettings.getSettings()
        return {
            minStartingCash: MIN_STARTING_CASH,
            maxStartingCash: MAX_STARTING_CASH,
            capacityFee: CAPACITY_FEE
        }
    }

    async inviteParticipant(participant: ParticipantDocument, competition: CompetitionDocument, owner: UserDocument) {
        if (participant.participant) {
            // participant is a user on trades trek
            await this.queueService.sendEmail({
                to: participant.email,
                template: '/CompetitionInvite',
                context: {competition, owner},
                subject: EMAIL_SUBJECTS.COMPETITION_INVITATION
            })
            await onesignalService.sendPushNotification(participant.participant, EMAIL_SUBJECTS.COMPETITION_INVITATION, `You have been invited to join ${competition.name}`, {})
        } else {
            // not a user on trades trek
        }
    }

    async getCompetitionRequests(user: UserDocument, pagination: Pagination) {
        const competitionRequests = await this.participantModel.find({
            email: user.email,
            joined: false
        },).skip(pagination.page).limit(pagination.limit)
        return successResponse({competition_requests: competitionRequests})
    }

    async getParticipants(competitionId: Types.ObjectId, loadParticipants: boolean = false): Promise<Participant[]> {
        return loadParticipants ? await this.participantModel.find({competition: competitionId}).populate('participant') : await this.participantModel.find({competition: competitionId})
    }

    async join(competitionId: Types.ObjectId, user: UserDocument, joinCompetitionDto: JoinCompetitionDto) {
        const competition = await this.findOne({'_id': competitionId})
        if (!competition) returnErrorResponse('Competition not found')
        // check if late entry is allowed
        if (!competition.allow_late_entry && competition.status === COMPETITION_STATUS.ONGOING) returnErrorResponse('You cannot join this competition after it has started')

        if (competition.entry === COMPETITION_ENTRY.CLOSED) {
            // compare password
            if (competition.password !== joinCompetitionDto.password) returnErrorResponse('Invalid competition password')
        }
        await this.joinCompetition(user, competition);
        return successResponse('joined successfully')
    }

    async resetPortfolio(competitionId: Types.ObjectId, user: UserDocument) {

    }

    async getTotalStartingCash(userId: Types.ObjectId, competitionId: Types.ObjectId): Promise<number> {
        const totalStartingCash = await this.participantModel.aggregate([
            {$match: {participant: userId, competition: competitionId}},
            {$group: {_id: null, starting_cash: {$sum: "$starting_cash"}}}
        ]).exec()
        return totalStartingCash[0].starting_cash;
    }


    async portfolio(portfolioDto: PortfolioDto, user: UserDocument, useService: boolean = false): Promise<{
        today_percentage_change: number,
        cash_value: number,
        account_value: number
    } | any> {
        // retrieve competition

        let competition = await this.competitionModel.findOne({'_id': portfolioDto.competition_id})
        if (!competition) returnErrorResponse('Competition does not exist')

        const todayPercentageChange = await this.accountValueService.getTodayPercentageChange(user, competition.id)
        const {cashValue, accountValue} = await this.accountValueService.getAccountAndCashValue(user, competition.id)

        return useService ? {
            today_percentage_change: todayPercentageChange,
            cash_value: cashValue,
            account_value: accountValue
        } : successResponse({
            today_percentage_change: todayPercentageChange,
            cash_value: cashValue,
            account_value: accountValue
        })
    }

    async portfolioDetails(portfolioDto: PortfolioDto, user: UserDocument) {
        const {today_percentage_change, cash_value, account_value} = await this.portfolio(portfolioDto, user, true)
        const pendingTrades = await this.orderService.getUserStocks(user, portfolioDto.competition_id, ORDER_STATUS.PENDING)
        const performanceHistory = await this.accountValueService.getAccountValueList(user, portfolioDto.competition_id);
        return successResponse({
            today_percentage_change,
            cash_value,
            account_value,
            pending_trades: pendingTrades,
            performance_history: performanceHistory
        })
    }

    async leaderBoard(competitionId: Types.ObjectId, pagination: Pagination) {
        const leaderBoardList = await this.participantModel.find({
            competition: competitionId,
            participant: {$ne: null}
        }).sort({points: -1}).populate('participant', 'full_name').limit(pagination.limit).skip(pagination.page).exec()
        return successResponse({leader_board_list: leaderBoardList})
    }


    // admin resource
    async getAllCompetitions(pagination: Pagination) {
        const count = await this.competitionModel.countDocuments({});
        const competitions = await this.competitionModel.find().skip(pagination.page).limit(pagination.limit).sort({created: -1}).exec();
        return successResponse({competitions, total_rows: count})
    }



}
