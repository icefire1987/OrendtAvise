import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AviseCundaService} from '../avise-cunda.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {MatTable} from '@angular/material';


@Component({
  selector: 'app-avise-cunda',
  templateUrl: './avise-cunda.component.html',
  styleUrls: ['./avise-cunda.component.css']
})


export class AviseCundaComponent implements OnInit {

    @ViewChild('downloadbutton') downloadbutton: ElementRef;
    @ViewChild('tableErrors') table: MatTable<any>;
    isLinear = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    stylelist: any = {
        all: [],
        ok: [],
        err: []
    };
    input_stylelist: string;
    csv_string: string;
    csvdata: string;
    safeURL: SafeUrl;
    fields: any[] = ['barcode','classificationNumber','codeNumber','itemNumber','productId',
        'productColourId','pricedProductId','advertNumber','outfitId','photoId','viewId','colourId',
        'advertDate','division','downwelt','kategorie','notes','productName','webshopBeschreibung','welt',
        'colourPositionNumber','computerSizeNumber','customerSizeNumber','storyIdDescription','licenseIdDescription',
        'environmentalIdDescription','brandDescription','arvatoStatus','arvatoStatusName','dataSource'
    ];
    columnsToDisplay = ['ean', 'message'];

    constructor(private _formBuilder: FormBuilder, private serviceCunda: AviseCundaService, private sanitizer: DomSanitizer ) {
    }

    ngOnInit() {
        this.stylelist = {
            all: [],
            ok: [],
            err: []
        };

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

        let my_string = '' + number;
        while (my_string.length < length) {
            my_string = '0' + my_string;
        }

        return my_string;

    }

    readList() {
        this.stylelist = {
            all: [],
            ok: [],
            err: []
        };
        this.stylelist.all = this.input_stylelist.split("\n");
        this.stylelist.all.forEach((ean,key,arr) => {
            ean = this.pad_with_zeroes(ean,13);
            this.serviceCunda.get(ean)
                .subscribe(
                    (data: any) => {
                            if (data.length > 1) {
                                this.stylelist.ok.push(data);
                            } else {
                                this.stylelist.err.push({ean: ean, message: data.message});
                                this.table.renderRows();
                            }

                            if (key === arr.length - 1) {
                                this.writeCSV();
                            }
                    },
                error => {
                        this.stylelist.err.push({ean: ean, message: error.statusText});
                    this.table.renderRows();
                    });
        });

    }

    writeCSV(){
        this.csv_string = "";
        if (!this.csv_string.match(/^data:text\/csv/i)) {
            this.csv_string = 'data:text/csv;charset=utf-8,' + this.csv_string;
        }
        this.fields.forEach( cell => {
            this.csv_string += cell + ';';
        }) ;
        this.csv_string += '\n';
        this.stylelist.ok.forEach( row => {
            row.forEach( cell => {
                this.csv_string += cell + ';';
            }) ;
            this.csv_string += '\n';
        });

        if (this.csv_string == null) return;

        this.csvdata = encodeURI(this.csv_string);
        this.safeURL = this.sanitizer.bypassSecurityTrustUrl(this.csvdata);
    }

    sendCSV() {
        console.info("cooming soon");


    }
}
