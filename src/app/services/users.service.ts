import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subject , throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({providedIn: 'root' })
export class UsersService {

    private url = environment.ApiUrl;

    createUpdateEntity = new Subject<any>();

    constructor(private http: HttpClient) { }

    public getUsers(): Observable<any> {
        return this.http.get(this.url + 'users').pipe(
        map((response: Response) => {
            return response;
        }), catchError( this.handleError));
    }

    public getUserById(id): Observable<any> {
        return this.http.get(this.url + 'users/' + id).pipe(
        map((response: Response) => {
            return response;
        }), catchError( this.handleError));
    }

    public createUser(user): Observable<any> {
        return this.http.post(this.url + 'users', user).pipe(
        map((response: Response) => {
            return response;
        }), catchError( this.handleError));
    }

    public updateUser(userdetails): Observable<any> {
        return this.http.put(this.url + 'users/', userdetails).pipe(
        map((response: Response) => {
            return response;
        }), catchError( this.handleError));
    }

    handleError(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`
        } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(errorMessage);
    }
}

