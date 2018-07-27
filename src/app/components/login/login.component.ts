import { environment } from '@environments/environment';
import { HarvestApiService } from '@app/services/harvest-api.service';
import { AuthService } from '@app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginMethod: string = "credentials";

  constructor(private auth: AuthService, private harvestApi: HarvestApiService, private router: Router) { }

  ngOnInit() {
  }

  public redirectToHarvest(): void {
    window.open(`https://id.getharvest.com/oauth2/authorize?client_id=${environment.oAuthClientId}&response_type=token`);
  }

  public setPersonalToken(token: string, userId: string): void {
    this.auth.authData.token = token;
    this.auth.authData.userId = userId;
    this.harvestApi.getProfile()
      .subscribe(profile => {
        this.auth.profile = profile;
        this.router.navigate(['/overtime']);
      }, () => alert(`Error`));
  }

}
