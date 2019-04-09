import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { eTimeSeries } from './interfaces/eTimeSeries';
import { AlphavantageService } from './services/alphavantage-service';
import { environment } from '../environments/environment';

// impoart { c } from 'highcharts';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
    public searchResult = [];
    private API_KEY = environment.alphavantageApiKey;


    constructor(private http: HttpClient, private alphavantageService: AlphavantageService) { }

    ngOnInit(): void {
        //     Highcharts.chart('container', {
        //       chart: {
        //           type: 'bar'
        //       },
        //       title: {
        //           text: 'Fruit Consumption'
        //       },
        //       xAxis: {
        //           categories: ['Apples', 'Bananas', 'Oranges']
        //       },
        //       yAxis: {
        //           title: {
        //               text: 'Fruit eaten'
        //           }
        //       },
        //       series: [{
        //           name: 'Jane',
        //           data: [1, 0, 4]
        //       }, {
        //           name: 'John',
        //           data: [5, 7, 3]
        //       }]
        //   });
    }

    // get list of all stocks and save to indexedDB



    public setUrl() {
    }

    public interday() {
        this.alphavantageService.callApi('AAPL', eTimeSeries.INTRADAY);
    }

    public weekley() {
        this.alphavantageService.callApi('AAPL', eTimeSeries.WEEKLY);
    }





}