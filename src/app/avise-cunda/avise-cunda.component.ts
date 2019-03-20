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

    stylelist: {
        all: string[],
        ok: string[][],
        err: {ean: string, message: string, formdata: any}[],
        special_err: {ean: string, message: string}[]
    } ;
    special_requestDone: boolean;
    input_stylelist: string;
    csv_string: string;
    csvdata: string;
    safeURL: SafeUrl;
    fields: any[] = ['barcode', 'classificationNumber', 'codeNumber', 'itemNumber', 'productId',
        'productColourId', 'pricedProductId', 'advertNumber', 'outfitId', 'photoId', 'viewId', 'colourId',
        'advertDate', 'division', 'downwelt', 'kategorie', 'notes', 'productName', 'webshopBeschreibung', 'welt',
        'colourPositionNumber', 'computerSizeNumber', 'customerSizeNumber', 'storyIdDescription', 'licenseIdDescription',
        'environmentalIdDescription', 'brandDescription', 'arvatoStatus', 'arvatoStatusName', 'dataSource'
    ];
    columnsToDisplay = ['ean', 'message', 'productID', 'color', 'size'];



    constructor(private _formBuilder: FormBuilder, private serviceCunda: AviseCundaService, private sanitizer: DomSanitizer ) {
    }
    static pad_with_zeroes(number, length) {

        let my_string = '' + number;
        while (my_string.length < length) {
            my_string = '0' + my_string;
        }

        return my_string;

    }
    ngOnInit() {
        this.stylelist = {
            all: [],
            ok: [],
            err: [],
            special_err: []
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
    readList() {
        this.stylelist = {
            all: [],
            ok: [],
            err: [],
            special_err: []
        };
        this.stylelist.all = this.input_stylelist.split('\n');
        this.stylelist.all = this.stylelist.all.filter(ean => ean !== '');
        this.stylelist.all.forEach((ean, key, arr) => {
            if (ean.length < 1) {
                return;
            }
            ean = AviseCundaComponent.pad_with_zeroes(ean, 13);
            this.serviceCunda.get(ean)
                .subscribe(
                    (data: any) => {
                            if (data.length > 1) {
                                this.stylelist.ok.push(data);
                            } else {
                                this.stylelist.err.push({
                                    ean: ean,
                                    message: data.message,
                                    formdata: {ean: ean, productId: 0, productColourId: 0, computerSizeNumber: '000'}});
                                this.table.renderRows();
                            }

                            if (key === arr.length - 1) {
                                this.writeCSV();
                            }
                    },
                error => {
                        this.stylelist.err.push({
                            ean: ean,
                            message: error.statusText,
                            formdata: {ean: ean, productId: 0, productColourId: 0, computerSizeNumber: '000'}});
                    this.table.renderRows();
                    });
        });

    }
    readSpecialList() {
        this.special_requestDone = false;
        this.stylelist.ok = [];
        this.stylelist.special_err = [];
        this.stylelist.err.forEach((item, key, arr) => {
            const formdata = item.formdata;
            this.serviceCunda.get_hub2(formdata)
                .subscribe(
                    (data: any) => {
                        if (data.length > 1) {
                            this.stylelist.ok.push(data);
                        } else {
                            this.stylelist.special_err.push({ean: formdata.ean, message: data.message});
                        }
                        if (key === arr.length - 1) {
                            this.writeCSV();
                            this.special_requestDone = true;
                        }
                    },
                    error => {
                        this.stylelist.special_err.push({ean: formdata.ean, message: error.statusText});
                    });
        });

    }
    writeCSV() {
        this.csv_string = '';
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

        if (this.csv_string == null) { return; }

        this.csvdata = encodeURI(this.csv_string);
        this.safeURL = this.sanitizer.bypassSecurityTrustUrl(this.csvdata);
    }

    sendCSV() {
        // coming soon
    }
}
