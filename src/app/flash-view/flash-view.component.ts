import { Component, OnInit } from '@angular/core';
// import {NgbCarousel} from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Rx';
import * as _ from 'underscore';

@Component({
  selector: 'app-flash-view',
  templateUrl: './flash-view.component.html',
  styleUrls: ['./flash-view.component.css']
})
export class FlashViewComponent implements OnInit {
  wordlist = [
    'ABLY',
    'ACHY',
    'ADDY',
    'ADRY',
    'AERY',
    'AFFY',
    'AGLY',
    'AHOY',
    'AIRY',
    'ALAY',
    'ALKY',
    'ALLY',
    'APAY',
    'ARMY',
    'ARSY',
    'ARTY',
    'ASHY',
    'AWAY',
    'AWFY',
    'AWNY',
    'AWRY'
  ];

  public speed = 1500;
  public wrapSlide = true;
  public useKeyboard = false;
  public slow = 10000;
  public medium = 5000;
  public fast = 1000;

  constructor() {}

  ngOnInit() {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
  }
  afterSlide($event) {
    console.log($event);
  }

  setSpeed(c, s) {
    // this.pauseSlide(); this.slideSpeed = this.speed; this.startSlide();
    // this.wrapSlide = !this.wrapSlide; c.interval = parseFloat(s);
    console.log(c);
    c.pause();
    const currentItem = c.activeId;
    this.speed = s;
    c.select(currentItem);
    // this.slider.interval = parseFloat(s);
    c.wrap = this.wrapSlide;
    c.cycle();
  }
}
