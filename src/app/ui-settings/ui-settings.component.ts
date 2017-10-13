import { Component, EventEmitter, OnInit, Output, Inject } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { COLORNAMES } from '../providers/providers';

@Component({
  selector: 'app-ui-settings',
  templateUrl: './ui-settings.component.html',
  styleUrls: ['./ui-settings.component.css']
})
export class UiSettingsComponent implements OnInit {
  localStorage: CoolLocalStorage;

  @Output() colorchange: EventEmitter<{}> = new EventEmitter<{}>();

  tilecolors: {} = {
    fgcolor: '#FAF0E6',
    bgcolor: '#663399'
  };

  constructor(
    @Inject(COLORNAMES) private colornames,
    localStorage: CoolLocalStorage
  ) {
    this.localStorage = localStorage;
  }

  ngOnInit() {
    const tc = this.localStorage.getObject('tilecolors');
    if (tc) {
      this.tilecolors = tc;
    }
  }

  onColorSelect(e: any): void {
    this.colorchange.emit(this.tilecolors);
    this.localStorage.setObject('tilecolors', this.tilecolors);
    console.log(this.tilecolors);
  }
}
