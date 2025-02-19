import instance from "../utils/network";

export function pushRegister(push: any): Promise<any> {
  return instance.post("/nest/push/register", push);
}
