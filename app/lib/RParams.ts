import { NextRequest } from "next/server";

export class RParams {
  data:object;

  constructor() {
    this.data = {};
  }

  async useRequest(request:NextRequest) {
    this.data = await request.json();
  }

  has(key:string):boolean {
    return this.data.hasOwnProperty(key);
  }

  get(key:string):any {
    // @ts-ignore
    return this.data[key];
  }
}