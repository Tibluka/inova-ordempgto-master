import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public router: Router) { }
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var isvalid = true;
    if(localStorage.getItem('logged-user')) {
      let parsed = JSON.parse(localStorage.getItem('logged-user'))
      let timestamp = parsed.timestamp
      let compareDate = new Date()
      compareDate.setHours((compareDate.getHours() -3))

      if(new Date(timestamp) > compareDate) {
        isvalid = true
      }
    }

    if(isvalid) {
      //TODO melhorar verificacao
      return true;
    } else {
      this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});
      return false;
    }
  }
}