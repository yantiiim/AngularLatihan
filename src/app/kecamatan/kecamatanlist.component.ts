import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Kecamatan } from './kecamatan';
import { KecamatanService } from './kecamatan.service';

@Component({
    selector: 'app-home',
    templateUrl: './kecamatanlist.component.html',
    providers: [KecamatanService]
})

export class KecamatanListComponent implements OnInit, AfterViewInit {
    // listKec: Kecamatan[];

    @ViewChild(DataTableDirective, {static: false})
    dtElement: DataTableDirective;
    dtOptions: any = {};
    dtTrigger: Subject<any> = new Subject();
    constructor(private kecamatanService: KecamatanService){

    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    ngOnInit(): void{
        const that = this;
        this.dtOptions = {
            ajax: (dataTablesParameters: any, callback) => {
                const parameter = new Map<string, any>();
                that.kecamatanService.getListKecamatanAll(parameter, dataTablesParameters).subscribe(resp => {
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
                data: 'idKecamatan',
                orderable: false
            }, {
                title: 'Name',
                data: 'namaKecamatan'
            }, {
                title: 'Kabupaten',
                data: 'namaKabupaten'
            },{
                title: 'Provinsi',
                data: 'namaProvinsi'
            },{
                title: 'Action',
                orderable: false,
                render(data, type, row) {
                    return '<a href="editmethod/${row.idKecamatan}" class="btn btn-warning btn-xs edit" data-element-id="${row.idKecamatan}"><i class ="glyphicon glyphicon-edit">Edit</i></a>'
                }
            }],
            rowCallback(row, data, dataIndex) {
                const idx = ((this.api().page()) * this.api().page.len()) + dataIndex + 1;
                $('td:eq(0)', row).html('<b>' + idx + '</b>');
                }
        };

        // this.kecamatanService.listKec().subscribe((data)=> {
        //     console.log(data);
        //     this.listKec = data;
        // }, error => {
        //     console.log(error);
        // })
    }
ngAfterViewInit() {
    
}

}