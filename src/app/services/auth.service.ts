import { HarvestProfile } from '@app/models/harvestProfile.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public profile: HarvestProfile
  public authData: {
    token: string,
    userId: string
  } = { token: "", userId: "" }
  constructor() { }
}
