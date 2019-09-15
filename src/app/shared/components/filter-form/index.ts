import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter-form',
  templateUrl: './index.html',
})
export class FilterFormComponent {
  @Input() filters: [Field];
  @Output() search = new EventEmitter();
  expandForm = false;

  emitSearch() {
    this.search.emit();
  }
}

export class Field {
  type: string;
  title: string;
  name: string;
  value: string;
  extra: Array<any>;

  constructor(type: string, title: string, name: string, extra: Array<any> = null) {
    this.type = type;
    this.title = title;
    this.name = name;
    this.extra = extra;
  }
}
