import { NextFunction, Request, Response } from "express";
import { literal } from "sequelize";

class Pagination {
	private _req: Request;
	private _res: Response;
	private _next: NextFunction;
	public search_string?: string;
	public page: number = 0;
	public limit: number = 10;
	public skip: number = 0;
	public sort?: string;
	public literal_fields: string[] = [];

	constructor(
		req: Request,
		res: Response,
		next: NextFunction,
		literal_fields: string[] = []
	) {
		this._req = req;
		this._res = res;
		this._next = next;
		try {
			const { search, limit, page, sort } = this._req.query;
			this.sort = sort ? this.replaceAll(sort?.toString(), " ", "") : undefined;
			this.limit =
				limit && parseInt(limit?.toString()) ? parseInt(limit?.toString()) : 10;
			this.search_string = search?.toString() || undefined;
			this.page =
				page && parseInt(page?.toString() || "0") > 1
					? parseInt(page?.toString() || "0")
					: 1;
			this.skip = (this.page - 1) * this.limit;
			this.literal_fields = literal_fields;
		} catch (err) {
			this._next(err);
		}
	}

	private replaceAll(str: string, find: string, replace: string) {
		return str.replace(new RegExp(find, "g"), replace);
	}

	public order(literal_fields: string[] = []) {
		if (!this.sort) return [];
		literal_fields = literal_fields.concat(this.literal_fields);

		return Array.from(this.sort, (s: string) =>
			s[0] === "-"
				? [
						literal_fields.includes(s.replace("-", ""))
							? literal(s.replace("-", ""))
							: s.replace("-", ""),
						"ASC",
				  ]
				: [literal_fields.includes(s) ? literal(s) : s, "DESC"]
		);
	}

	public arrange(data: any) {
		return {
			success: true,
			message: "Data fetched sucessfully",
			data: data.rows,
			total: data.count,
			limit: this.limit,
			page: this.page,
			hasNextPage: Math.ceil(data.count / this.limit) - this.page > 0,
			hasPreviousPage: this.page > 1,
			totalPages: Math.ceil(data.count / this.limit),
		};
	}

	public arrange_and_send(data: any, status: number = 200) {
		this._res.status(status).json(this.arrange(data));
	}
}
