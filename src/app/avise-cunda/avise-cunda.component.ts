import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AviseCundaService} from '../avise-cunda.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';


@Component({
  selector: 'app-avise-cunda',
  templateUrl: './avise-cunda.component.html',
  styleUrls: ['./avise-cunda.component.css']
})



export class AviseCundaComponent implements OnInit {

    @ViewChild('downloadbutton') downloadbutton: ElementRef;

    isLinear = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    stylelist: any;
    input_stylelist: string;
    csv_string: string;
    csvdata: string;
    safeURL: SafeUrl;

    constructor(private _formBuilder: FormBuilder, private serviceCunda: AviseCundaService, private sanitizer: DomSanitizer ) {
        this.stylelist = {
            all: [],
            ok: [],
            err: []
        };
    }

    ngOnInit() {
        this.firstFormGroup = this._formBuilder.group({
            stylelistCtrl: ['', Validators.required]
        });
        this.secondFormGroup = this._formBuilder.group({
            readStylelistCtrl: ['']
        });
        this.thirdFormGroup = this._formBuilder.group({
            writeStylelistCtrl: ['']
        });
    }

    pad_with_zeroes(number, length) {

        var my_string = '' + number;
        while (my_string.length < length) {
            my_string = '0' + my_string;
        }

        return my_string;

    }

    readList() {
        this.stylelist.all = this.input_stylelist.split("\n");
        this.stylelist.all.forEach((ean,key,arr) => {
            ean = this.pad_with_zeroes(ean,13);
            this.serviceCunda.get(ean)
                .subscribe(
                    (data: any) => {
                            if (data.length > 1) {
                                this.stylelist.ok.push(data);
                            } else {
                                this.stylelist.err.push(ean);
                            }
                            console.log(key);

                            if(key==arr.length-1){
                                this.writeCSV();
                            }
                    },
                error => {
                        console.log(error.statusText);
                        this.stylelist.err.push(ean);
                    });
        });

    }

    writeCSV(){
        this.csv_string = "";
        this.stylelist.ok.forEach( row => {
            console.log(row)
            row.forEach( cell => {
                console.log(cell)
                this.csv_string += cell + ';';
            }) ;
            this.csv_string += '\n';
        });
        if (this.csv_string == null) return;

        if (!this.csv_string.match(/^data:text\/csv/i)) {
            this.csv_string = 'data:text/csv;charset=utf-8,' + this.csv_string;
        }
        this.csvdata = encodeURI(this.csv_string);
        this.safeURL = this.sanitizer.bypassSecurityTrustUrl(this.csvdata);
    }
    sendCSV() {
        this.csvdata = encodeURI(this.csv_string);
        this.downloadbutton.nativeElement.setAttribute("href", this.csvdata);
        this.downloadbutton.nativeElement.style.color = "green";


    }
}
