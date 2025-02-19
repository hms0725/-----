import {iamportCertifications, iamportFindCertifications} from "../api/auth";

export function certification(find?: boolean) {
  return new Promise<{
    username: string;
    phoneNumber: string;
    birth: string[];
    gender: 'MALE' | 'FEMALE';
    existed: boolean;
    exited: boolean;
    userId?: number;
    nickname?: string;
    textId?: string;
  }>((resolve, reject) => {
    if (!window.IMP) {
      return reject(new Error('failed to init'));
    }

    window.IMP.certification({
      merchant_uid: 'merchant_' + new Date().getTime(),
      popup: false
    }, async (resp) => {
      if (resp.success) {
        try {
          const certFn = find ? iamportFindCertifications : iamportCertifications;
          const certResp = await certFn({
            impUid: resp.imp_uid,
            merchantUid: resp.merchant_uid
          });

          const [birthYear, birthMonth, birthDate] = certResp.data.birthday.split('-');
          resolve({
            username: certResp.data.name,
            phoneNumber: certResp.data.phone,
            birth: [birthYear, birthMonth, birthDate],
            gender: certResp.data.gender === 'male' ? 'MALE' : 'FEMALE',
            existed: certResp.isAlreadyExistUser,
            exited: certResp.isAlreadyExitUser,
            userId: certResp.userId,
            nickname: certResp.nickname,
            textId: certResp.textId,
          })
        } catch (e: any) {
          const msg = typeof e === 'string' ? e : e.message;
          reject(new Error(msg));
        }
      } else {
        reject(new Error(resp.error_msg));
      }
    });
  });
}