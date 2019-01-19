import { Component, OnInit, OnDestroy } from '@angular/core';

import { MembersService } from '../services/members/members.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.page.html',
  styleUrls: ['./member-details.page.scss'],
})
export class MemberDetailsPage implements OnInit, OnDestroy {
  memberDetails = {};
  memberDetails$: Subscription;

  constructor(private membersService: MembersService) { }

  ngOnInit() {
    this.memberDetails$ = this.membersService.memberDetails_content$.subscribe(details => this.memberDetails = details);
  }

  ngOnDestroy() {
    this.memberDetails$.unsubscribe();
  }
}
