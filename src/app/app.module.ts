import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Socket client configuration
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

// Libraries
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { NgTerminalModule } from 'ng-terminal';

// Components
import { CodeDocumentComponent } from './sections/code-area/code-document/code-document.component';

// Routes
import { AppRoutingModule } from './routes/app.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { TerminalComponent } from './sections/code-area/terminal/terminal.component';
import { DashboardComponent } from './sections/dashboard/dashboard.component';

const config: SocketIoConfig = { url: environment.socketServer, options: {}};

@NgModule({
  declarations: [
    AppComponent,
    CodeDocumentComponent,
    TerminalComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(config),
    AppRoutingModule,
    CodemirrorModule,
    ReactiveFormsModule,
    NgTerminalModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
