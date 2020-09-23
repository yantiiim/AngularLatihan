import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Kabupaten } from '../kabupaten/kabupaten';
import { KabupatenService } from '../kabupaten/kabupaten.service';
import { Provinsi } from '../provinsi/provinsi';
import { ProvinsiService } from '../provinsi/provinsi.service';
import { Kecamatan } from './kecamatan';
import { KecamatanService } from './kecamatan.service';

@Component({
    selector: 'app-kecamatan',
    templateUrl: './kecamatan.component.html',
    providers: [KecamatanService, KabupatenService, ProvinsiService]
  })

  export class KecamatanComponent implements OnInit {

    id: string;
    addKecamatanForm: FormGroup;

    listProv: Provinsi[];
    listKab: Kabupaten[];
    
      constructor(private kecamatanService: KecamatanService, private kabupatenService: KabupatenService, private provinsiService: ProvinsiService, private route: ActivatedRoute, private router: Router) {
        this.addKecamatanForm = new FormGroup({
            idKecamatan: new FormControl(null, [Validators.required]),
            namaKecamatan: new FormControl(null, [Validators.required]),
            kodeKabupaten: new FormControl(null, [Validators.required]),
            kodeProvinsi: new FormControl(null, [Validators.required])
          });
  
          this.kabupatenService.listKab().subscribe((data)=> {
            console.log(data);
            this.listKab = data;
        }, error => {
            console.log(error);
        })

          this.provinsiService.listProvinsi().subscribe((data)=> {
              console.log(data);
              this.listProv = data;
          }, error => {
              console.log(error);
          })
      }
    
      ngOnInit(): void {
        this.route.params.subscribe(rute => {
            this.id = rute.id;
            this.kecamatanService.getKecamatanById(this.id).subscribe(data => {
              this.addKecamatanForm.get('idKecamatan').setValue(data.idKecamatan);
              this.addKecamatanForm.get('namaKecamatan').setValue(data.namaKecamatan);
              this.addKecamatanForm.get('kodeKabupaten').setValue(data.kodeKabupaten);
              this.addKecamatanForm.get('kodeProvinsi').setValue(data.kodeProvinsi);
            }, error => {
              alert("Data Tidak Ditemukan !");
            });
          });
      }
    
      simpanKec(): void {
        console.log(this.addKecamatanForm.value);
        let kec = new Kecamatan();
        kec.idKecamatan = this.addKecamatanForm.value.idKecamatan;
        kec.namaKecamatan = this.addKecamatanForm.value.namaKecamatan;
        kec.kodeKabupaten = this.addKecamatanForm.value.kodeKabupaten;
        kec.kodeProvinsi = this.addKecamatanForm.value.kodeProvinsi;
        this.kecamatanService.insertKec(kec).subscribe((data) => {
          console.log(data);
          this.router.navigate(['/listkec']);
        });
      }
    
      ambilKabupaten(): void {
        const idProv = this.addKecamatanForm.get('kodeProvinsi').value;
        this.kecamatanService.listKabupaten(idProv).subscribe( data => {
          this.listKab = data;
        });
      }

    }