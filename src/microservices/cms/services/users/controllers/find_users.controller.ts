import { Request, Response, NextFunction } from "express";

export const findUsers = (req: Request, res: Response) => {
	res.send("Express + TypeScript Server");
};
