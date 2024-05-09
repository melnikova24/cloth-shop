import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BASE_URL} from "../../constants";
import {ISubtype} from "./models";

@Injectable({
  providedIn: 'root'
})
export class SubtypeService {

  constructor(private http: HttpClient) { }



  getSubtypes() {
    return this.http.get<Record<string, string>>(BASE_URL+'/subtypes');
  }
}
