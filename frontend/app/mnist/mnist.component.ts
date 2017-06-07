import {
  Component,
  OnDestroy,
} from '@angular/core';

import {
  Http,
  Response,
  Headers,
  RequestOptions,
} from '@angular/http';

import {
  Observable,
} from 'rxjs/Rx';

import {
  MdSnackBar,
} from '@angular/material';

import {
  Request,
  Item,
} from '../request-item.component';

@Component({
  selector: 'app-mnist',
  templateUrl: 'mnist.component.html',
  styleUrls: ['mnist.component.css'],
})
export class MNISTComponent implements OnDestroy {
  mode = 'Observable';
  private endpoint = 'mnist-request';

  inputValue: string;

  sresp: Item;
  srespError: string;
  result: string;

  inProgress = false;
  spinnerColor = 'primary';
  spinnerMode = 'determinate';
  spinnerValue = 0;

  pollingHandler;

  constructor(private http: Http, public snackBar: MdSnackBar) {
    this.inputValue = '';
    this.srespError = '';
    this.result = 'No results to show yet...';
  }

  ngOnDestroy() {
    console.log('Disconnected (user left the page)!');
    clearInterval(this.pollingHandler);
    return;
  }

  processItem(resp: Item) {
    this.sresp = resp;
    this.result = resp.value;
    this.inProgress = resp.progress < 100;
    this.spinnerMode = 'determinate';
    this.spinnerValue = resp.progress;
    if (this.inProgress !== true) {
      console.log('Finished', resp);
      clearInterval(this.pollingHandler);
    }
  }

  processHTTPResponseClient(res: Response) {
    let jsonBody = res.json();
    let sresp = <Item>jsonBody;
    return sresp || {};
  }

  processHTTPErrorClient(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    this.srespError = errMsg;
    return Observable.throw(errMsg);
  }

  postRequest(creq: Request): Observable<Item> {
    let body = JSON.stringify(creq);
    let headers = new Headers({'Content-Type' : 'application/json'});
    let options = new RequestOptions({headers : headers});

    // this returns without waiting for POST response
    let obser = this.http.post(this.endpoint, body, options)
      .map(this.processHTTPResponseClient)
      .catch(this.processHTTPErrorClient);
    return obser;
  }

  processRequest() {
    let val = this.inputValue;
    let creq = new Request('http://aaa.com', val);
    let responseFromSubscribe: Item;
    this.postRequest(creq).subscribe(
      sresp => responseFromSubscribe = sresp,
      error => this.srespError = <any>error,
      () => this.processItem(responseFromSubscribe), // on-complete
    );
    this.snackBar.open('Predicting correct words...', 'Requested!', {
      duration: 5000,
    });
    this.inProgress = true;
    this.spinnerMode = 'indeterminate';
  }

  clickProcessRequest() {
    this.pollingHandler = setInterval(() => this.processRequest(), 1000);
  }
}
