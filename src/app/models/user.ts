import {UserPayment} from './user-payment';
import {UserShipping} from './user-shipping';

export class User {
	public id: number;
	public firstName: string;
	public lastName: string;
	public username: string;
  public password: string;
  public cpassword: string;
  public city: string;
  public state: string;
  public country: string;
	public address: string;
	public email: string
	public phone: string;
	public enabled: boolean;
	public userPaymentList: UserPayment[];
  public userShippingList: UserShipping[];
  public authorities:any;
}
