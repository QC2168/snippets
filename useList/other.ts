import response from './data.json'

/**
 * ProfileBody
 */
 export interface ProfileBody {
    /**
     * Avatar，用户头像地址
     */
    avatar?: string;
    /**
     * Birthday
     */
    birthday?: string;
    /**
     * Date Join
     */
    dateJoin?: string;
    /**
     * Email
     */
    email?: string;
    /**
     * Gender
     */
    gender?: number;
    /**
     * Group
     */
    group?: string;
    /**
     * Id
     */
    id?: number;
    /**
     * Invitation Code
     */
    invitationCode?: string;
    /**
     * Is Active
     */
    isActive?: boolean;
    /**
     * Last Login
     */
    lastLogin?: string;
    /**
     * Mobile
     */
    mobile?: string;
    /**
     * National Name，证件上的名字（真实名字）
     */
    nationalName?: string;
    /**
     * Nickname，用户呢称
     */
    nickname?: string;
    /**
     * Residential Region，用户所属居住地区（中文字符）
     */
    residentialRegion?: string;
    /**
     * User
     */
    user?: string;
  }

  export interface ResponseType<T = any> {
    data: T;
    meta: {
      total: number;
    };
  }
 export function requestFn(): Promise<ResponseType<ProfileBody[]>> {
    return new Promise((resolve, reject) => {
      resolve(response);
    });
  }