import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Kabupaten } from './kabupaten';
import { KabupatenService } from './kabupaten.service';

@Component({
    selector: 'app-home',
    templateUrl: './kabupatenlist.component.html',
    providers: [KabupatenService]
})

export class KabupatenListComponent implements OnInit, AfterViewInit {
    // listKab: Kabupaten[];

    @ViewChild(DataTableDirective, {static: false})
    dtElement: DataTableDirective;
    dtOptions: any = {};
    dtTrigger: Subject<any> = new Subject();
    cariForm: FormGroup;
    constructor(private kabupatenService: KabupatenService){

    }

    

    ngOnInit(): void{
        this.cariForm = new FormGroup( {
            namaKabupaten: new FormControl('')
        });

        const that = this;
        this.dtOptions = {
            ajax: (dataTablesParameters: any, callback) => {
                const parameter = new Map<string, any>();
                parameter.set('namaKabupaten', this.cariForm.controls.namaKabupaten.value);
                that.kabupatenService.getListKabupatenAll(parameter, dataTablesParameters).subscribe(resp => {
                    callback({
                        recordsTotal: resp.recordsTotal,
                        recordsFiltered: resp.recordsFiltered,
                        data: resp.data,
                        draw: resp.draw
                    })
                })
            },
            serverSide: true,
            processing: true,
            filter: false,
            columns: [{
                title: 'ID',
                data: 'idKabupaten',
                orderable: false
            }, {
                title: 'Name',
                data: 'namaKabupaten'
            }, {
                title: 'NameProvinsi',
                data: 'namaProvinsi'
            },{
                title: 'Action',
                orderable: false,
                render(data, type, row) {
                    return '<a href="editmethod/${row.idKabupaten}" class="btn btn-warning btn-xs edit" data-element-id="${row.idKabupaten}"><i class ="glyphicon glyphicon-edit">Edit</i></a>'
                }
            }],
            rowCallback(row, data, dataIndex) {
                const idx = ((this.api().page()) * this.api().page.len()) + dataIndex + 1;
                $('td:eq(0)', row).html('<b>' + idx + '</b>');
                }
        };

        // this.kabupatenService.listKab().subscribe((data)=> {
        //     console.log(data);
        //     this.listKab = data;
        // }, error => {
        //     console.log(error);
        // })
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
    }

ngAfterViewInit() {
    
}

}