import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({selector: 'app-move-nav', templateUrl: './move-nav.component.html', styleUrls: ['./move-nav.component.css']})
export class MoveNavComponent {
  @Input()movenav;
  @Input()page : number;
  @Output()paginationchange : EventEmitter < number > = new EventEmitter < number > ();

  public turns : number;
  public currentPage : number;
  public disabled = false;

  constructor() {}

  public onPageChanged(event : any) : void {
    this.currentPage = +event;
    console.log('currentPage ' + this.currentPage);
    this
      .paginationchange
      .emit(this.currentPage);
    // EmitterService.get(this.page).emit(+event.page);
  }
}
