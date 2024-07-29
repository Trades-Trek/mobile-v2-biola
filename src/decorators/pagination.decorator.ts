import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { Pagination } from "../enums/pagination.enum";

export const GetPagination = createParamDecorator((data, ctx: ExecutionContext): Pagination => {
    const req: Request = ctx.switchToHttp().getRequest();

    const paginationParams: Pagination = {
        page: 0,
        limit: 0,
        sort: [],
        search: [],
        filter: null
    };

    paginationParams.page = req.query.page ? parseInt(req.query.page.toString()) - 1 : 0;
    paginationParams.limit = req.query.limit ? parseInt(req.query.limit.toString()) : 20;
    paginationParams.filter = req.query.filter ? req.query.filter.toString() : null;

    // create array of sort
    if (req.query.sort) {
        const sortArray = req.query.sort.toString().split(",");
        paginationParams.sort = sortArray.map(sortItem => {
            const sortBy = sortItem[0];
            switch (sortBy) {
                case "-":
                    return {
                        field: sortItem.slice(1),
                        by: "ASC"
                    };
                case "+":
                    return {
                        field: sortItem.slice(1),
                        by: "ASC"
                    };
                default:
                    return {
                        field: sortItem.trim(),
                        by: "DESC"
                    };
            }
        });
    }

    // create array of search
    if (req.query.search) {
        const searchArray = req.query.search.toString().split(",");
        paginationParams.search = searchArray.map(searchItem => {
            const field = searchItem.split(":")[0];
            const value = searchItem.split(":")[1];
            return {
                field,
                value
            };
        });
    }

    return paginationParams;
});