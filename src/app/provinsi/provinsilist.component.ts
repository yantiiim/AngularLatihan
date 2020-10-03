import { OnInit, ViewChild } from '@angular/core';
import { AfterViewInit, Component } from "@angular/core";
import { FormControl, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Provinsi } from './provinsi';
import { ProvinsiService } from './provinsi.service';


@Component({
    selector: 'app-home',
    templateUrl: './provinsilist.component.html',
    providers: [ProvinsiService]
})

export class ProvinsiListComponent implements OnInit, AfterViewInit {
    // listProv: Provinsi[];
    @ViewChild(DataTableDirective, {static: false})
    dtElement: DataTableDirective;
    dtOptions: any = {};
    dtTrigger: Subject<any> = new Subject();
    cariForm: FormGroup;
    constructor(private provinsiService: ProvinsiService){

    }

    

    ngOnInit(): void{
        this.cariForm = new FormGroup( {
            namaProvinsi: new FormControl('')
        });

        const that = this;
        this.dtOptions = {
            ajax: (dataTablesParameters: any, callback) => {
                const parameter = new Map<string, any>();
                parameter.set('namaProvinsi', this.cariForm.controls.namaProvinsi.value);
                that.provinsiService.getListProvinsiAll(parameter, dataTablesParameters).subscribe(resp => {
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
                data: 'idProvinsi',
                orderable: false
            }, {
                title: 'Name',
                data: 'namaProvinsi'
            }, {
                title: 'Action',
                orderable: false,
                render(data, type, row) {
                    return '<a href="editmethod/${row.idProvinsi}" class="btn btn-warning btn-xs edit" data-element-id="${row.idProvinsi}"><i class ="glyphicon glyphicon-edit">Edit</i></a>'
                }
            }],
            rowCallback(row, data, dataIndex) {
                const idx = ((this.api().page()) * this.api().page.len()) + dataIndex + 1;
                $('td:eq(0)', row).html('<b>' + idx + '</b>');
                }
        };
        
        // this.provinsiService.listProvinsi().subscribe((data)=> {
        //     console.log(data);
        //     this.listProv = data;
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