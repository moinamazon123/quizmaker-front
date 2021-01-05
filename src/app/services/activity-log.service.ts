import { Injectable } from '@angular/core';
import {Headers, Http} from "@angular/http";


@Injectable()
export class ActivityLogService {

  constructor (private http: Http) {}

  getWithExpiry(key) {
	const itemStr = localStorage.getItem(key)
	// if the item doesn't exist, return null
	if (!itemStr) {
		return null
	}
	const item = JSON.parse(itemStr);
	const now = new Date()
	// compare the expiry time of the item with the current time
	if (now.getTime() > item.expiry) {
		// If the item is expired, delete the item from storage
		// and return null
        localStorage.removeItem(key)
        console.log("Session Expired");
		return null
	}
	return item.value
}

  getActivityLog() {
    let url = "http://localhost:8181/quizmaker/getActivity/"+Number(this.getWithExpiry("userId"));
   
    return this.http.get(url);
  }

  

}
