import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Provinsi } from './provinsi';
import { ProvinsiService } from './provinsi.service';

@Component({
  selector: 'app-provinsi',
  templateUrl: './provinsi.component.html',
  providers: [ProvinsiService]
})
export class ProvinsiComponent implements OnInit {

  id: string;
addProvinsiForm: FormGroup;
alamatGambar: string;

selectedFiles: FileList;
currentFile: File;
progress = 0;

  constructor(private provinsiService: ProvinsiService, private route: ActivatedRoute, private router: Router) {
    this.addProvinsiForm = new FormGroup({
      idProvinsi: new FormControl(null, [Validators.required]),
      namaProvinsi: new FormControl(null, [Validators.required, Validators.minLength(3)])
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(rute => {
      this.id = rute.id;
      if (this.id) {
        this.provinsiService.getProvinsiById(this.id).subscribe( data => {
          this.alamatGambar = environment.baseUrl + '/image/bas2.jpeg'
          this.addProvinsiForm.get('idProvinsi').setValue(data.idProvinsi);
          this.addProvinsiForm.get('namaProvinsi').setValue(data.namaProvinsi);
        }, error => {
          alert("Data Tidak Ditemukan !");
        });
      }
    });
  }

  simpanProv(): void {
    this.upload();
    console.log(this.addProvinsiForm.value);
    let prov = new Provinsi();
    prov.idProvinsi = this.addProvinsiForm.value.idProvinsi;
    prov.namaProvinsi = this.addProvinsiForm.value.namaProvinsi;
    this.provinsiService.insertProv(prov).subscribe((data) => {
      
      console.log(data);
      this.router.navigate(['/listprov']);
    });
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  upload() {
    this.progress = 0;

    this.currentFile = this.selectedFiles.item(0);
    this.provinsiService.upload(this.currentFile).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round( 100 * event.loaded / event.total);
        }else if (event instanceof HttpResponse) {
          console.log(event.body);
        }
      },
      err => {
        this.progress = 0;
        alert('Could not upload the file!');
        this.currentFile = undefined;
      });

    this.selectedFiles = undefined;
  }

}
