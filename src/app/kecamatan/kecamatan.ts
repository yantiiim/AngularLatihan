import { Kabupaten } from '../kabupaten/kabupaten';
import { Provinsi } from '../provinsi/provinsi';

export class Kecamatan{
    idKecamatan: number;
    namaKecamatan: string;
    kabupaten: Kabupaten;
    kodeKabupaten: number;
    provinsi: Provinsi;
    kodeProvinsi:number;
}