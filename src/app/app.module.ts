import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BackendMockInterceptor } from './interceptors/backend-mock.interceptor';
import { ListComponent } from './components/list/list.component';
import { CreationFormComponent } from './components/creation-form/creation-form.component';
import { EditingFormComponent } from './components/editing-form/editing-form.component';

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ListComponent,
        HttpClientModule,
        CreationFormComponent,
        EditingFormComponent
    ],
  providers: [
      { provide: HTTP_INTERCEPTORS, useClass: BackendMockInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
