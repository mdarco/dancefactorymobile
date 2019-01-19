import { Component, OnInit, OnDestroy } from '@angular/core';

import { MembersService } from '../services/members/members.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-member',
  templateUrl: './member.page.html',
  styleUrls: ['./member.page.scss'],
})
export class MemberPage implements OnInit, OnDestroy {
  headerMemberName: string = '< header_member_name >';
  headerMemberName$: Subscription;

  constructor(private membersService: MembersService) { }

  ngOnInit() {
    this.headerMemberName$ = this.membersService.memberDetails_header_memberName$.subscribe(name => this.headerMemberName = name);
  }

  ngOnDestroy() {
    this.headerMemberName$.unsubscribe();
  }
}
