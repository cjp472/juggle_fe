import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { Field } from '../../../shared/components/filter-form';
import { HttpService } from 'src/app/common/http.service';
import { ModalService } from 'src/app/common/modal.service';
import { ShopTypeListEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-type-list',
  templateUrl: './type-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopTypeListComponent implements OnInit {
  constructor(
    public msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private httpService: HttpService,
    private modalService: ModalService,
    private modal: ModalHelper,
  ) {}
  loading = false;
  filters: Array<Field> = [];
  listOfMapData = [];
  mapOfExpandedData: { [id: string]: TreeNodeInterface[] } = {};

  ngOnInit(): void {
    this.setupFilters();
    this.getData();
  }

  setupFilters() {
    this.filters.push(new Field('input', '名称', 'name'));
    this.filters.push(
      new Field('select', '启用', 'enabled', [{ label: '是', value: true }, { label: '否', value: false }]),
    );
  }

  getData() {
    this.loading = true;
    this.httpService.post(
      '/v1/shop/shopType/searchTree',
      { filters: this.filterHandel(this.filters) },
      {
        success: res => {
          this.listOfMapData = res.data;
          this.loading = false;
          this.listOfMapData.forEach(item => {
            this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
          });
          this.cdr.detectChanges();
        },
      },
    );
  }

  openEdit(record: any = {}) {
    this.modal.create(ShopTypeListEditComponent, { record }, { size: 'md' }).subscribe(res => {
      this.reset();
      this.cdr.detectChanges();
    });
  }

  remove(item: any) {
    this.modalService.showDeleteConfirm('确定要删除吗?', () => {
      this.httpService.post(
        '/v1/shop/shopType/' + item.id + '/remove',
        {},
        {
          success: res => {
            this.msg.success('删除成功');
            this.reset();
          },
        },
      );
    });
  }

  changeEnabled(item: any) {
    let content = '确定要禁用该商品分类吗?';
    let url = '/v1/shop/shopType/' + item.id + '/disable';
    if (!item.enabled) {
      content = '确定要启用该商品分类吗?';
      url = '/v1/shop/shopType/' + item.id + '/enable';
    }
    this.modalService.showDeleteConfirm(content, () => {
      this.httpService.post(
        url,
        {},
        {
          success: res => {
            this.msg.success('操作成功');
            this.reset();
          },
        },
      );
    });
  }

  filterHandel(filters: Array<Field>) {
    const handels: Array<any> = [];
    filters.forEach(filter => {
      if (filter.value !== undefined && filter.value !== null) {
        if (filter.type === 'input') {
          handels.push({ name: filter.name, op: '*', value: filter.value });
        } else {
          handels.push({ name: filter.name, value: filter.value });
        }
      }
    });
    return handels;
  }

  reset() {
    setTimeout(() => this.getData());
  }

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.id === d.id)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: object): TreeNodeInterface[] {
    const stack: any[] = [];
    const array: any[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });
    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level + 1, expand: false, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: { [id: string]: any }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }
}

export interface TreeNodeInterface {
  id: number;
  name: string;
  detail: string;
  enabled: boolean;
  level: number;
  expand: boolean;
  children?: TreeNodeInterface[];
}
