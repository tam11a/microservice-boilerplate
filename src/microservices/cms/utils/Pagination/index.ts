import { NextFunction, Request, Response } from "express";
import { Op, literal } from "sequelize";

class Pagination {
	private _req: Request;
	private _res: Response;
	private _next: NextFunction;
	public search_string?: string;
	public page: number = 0;
	public limit: number = 10;
	public skip: number = 0;
	public show_paranoid: boolean = true;
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
			const { search, limit, page, sort, show_paranoid } = this._req.query;
			this.sort = sort ? this.replaceAll(sort?.toString(), " ", "") : undefined;
			this.limit =
				limit && parseInt(limit?.toString()) ? parseInt(limit?.toString()) : 10;
			this.search_string = search?.toString() || "";
			this.page =
				page && parseInt(page?.toString() || "0") > 1
					? parseInt(page?.toString() || "0")
					: 1;
			this.skip = (this.page - 1) * this.limit;
			this.literal_fields = literal_fields;

			this.show_paranoid =
				show_paranoid !== null && show_paranoid !== undefined
					? show_paranoid === "true"
						? true
						: false
					: true;
		} catch (err) {
			this._next(err);
		}

		this.replaceAll = this.replaceAll.bind(this);
		this.order = this.order.bind(this);
		this.get_attributes = this.get_attributes.bind(this);
		this.get_search_ops = this.get_search_ops.bind(this);
		this.format_filters = this.format_filters.bind(this);
		this.arrange = this.arrange.bind(this);
		this.arrange_and_send = this.arrange_and_send.bind(this);
	}

	public toBoolean(value: any) {
		return value !== null && value !== undefined
			? ["true", "True", true, 1].includes(value)
				? true
				: ["false", "False", false, 0].includes(value)
				? false
				: undefined
			: undefined;
	}

	private replaceAll(str: string, find: string, replace: string) {
		return str.replace(new RegExp(find, "g"), replace);
	}

	public order(literal_fields: string[] | undefined = []) {
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

	public get_attributes(literal_fields: string[] | undefined = []) {
		return {
			offset: this.skip,
			limit: this.limit,
			order: this.order(literal_fields),
			paranoid: this.show_paranoid,
		};
	}

	public get_search_ops(search_fields: string[] = []) {
		return Array.from(search_fields, (f: string) => ({
			[f]: {
				[Op.like]: `%${this.search_string}%`,
			},
		}));
	}

	public format_filters(filter_object: { [key: string]: any }) {
		const output_object: { [key: string]: any } = {};
		for (const key in filter_object) {
			if (filter_object[key] !== null && filter_object[key] !== undefined) {
				output_object[key] = filter_object[key];
			}
		}
		return output_object;
	}

	public arrange(data: any) {
		return {
			success: true,
			message: "Data fetched sucessfully",
			data: data.rows,
			total: data.count,
			limit: this.limit,
			page: this.page,
			has_next_page: Math.ceil(data.count / this.limit) - this.page > 0,
			has_previous_page: this.page > 1,
			total_pages: Math.ceil(data.count / this.limit),
			showing_soft_deleted: !this.show_paranoid,
		};
	}

	public arrange_and_send(data: any, status: number = 200) {
		this._res.status(status).json(this.arrange(data));
	}
}

export default Pagination;
