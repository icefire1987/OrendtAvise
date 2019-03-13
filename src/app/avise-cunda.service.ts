import {ElementRef, Injectable, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, mergeMap} from 'rxjs/operators';
import 'rxjs-compat/add/operator/map';


@Injectable({
  providedIn: 'root'
})
export class AviseCundaService {



    url_hub1: string;
    url_hub2_product: string;
    url_hub2_color: string;
    url_hub2_size: string;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'text/plain',
            'Authorization': 'Basic ' + btoa("I12W36:5Vq+-bBAnXD2X3eVpkH%")
        })
    };

    @ViewChild('downloadbutton') downloadbutton: ElementRef;

    constructor(private http: HttpClient) {
        this.url_hub1 = 'https://ecomhub-picture-prod.eu.cloudhub.io/api/barcodes/';
        this.url_hub2_product = 'https://ecomhub-picture-prod.eu.cloudhub.io/api/pictureprovider/productinformation/productId/';
        this.url_hub2_color = '/productcolourId/';
        this.url_hub2_size = '/computersize/';
    }

    get(ean) {
        return this.http
            .get(this.url_hub1 + ean, this.httpOptions)
            .pipe(
                mergeMap( (res1: any) => {
                    if (res1.error.code === "0") {
                        return this.http.get(
                            this.url_hub2_product + res1.productId +
                            this.url_hub2_color + res1.productColourId +
                            this.url_hub2_size + res1.computerSizeNumber
                        )
                            .map((res2: any) => {
                                return [
                                    ean,
                                    res2.class,
                                    res2.code,
                                    res1.itemNumber,
                                    res1.productId,
                                    res1.productColourId,
                                    res1.pricedProductId,
                                    res2.advertNumber,
                                    "", "", "", "",
                                    res2.advertDate,
                                    res2.division,
                                    res2.downWorld,
                                    res2.category,
                                    JSON.stringify(res2.erpAdditionalInformation),
                                    res2.pimProductName,
                                    "",
                                    res2.world,
                                    res1.colourPositionNumber,
                                    res1.computerSizeNumber,
                                    res2.customerSize,
                                    "", "",
                                    res2.erpProductDescription,
                                    "", "115", "NewArticle",
                                    ""
                                ];
                            });
                    } else {
                        return [res1.error];
                    }
                })
            );
    }

}
