import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-trainings-member-presence',
  templateUrl: './trainings-member-presence.page.html',
  styleUrls: ['./trainings-member-presence.page.scss'],
})
export class TrainingsMemberPresencePage implements OnInit {

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }
}
