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
import { LoginComponent } from './sections/login/login.component';
import { SignUpComponent } from './sections/sign-up/sign-up.component';
import { HttpClientModule } from '@angular/common/http';
import { TerminalComponent } from './sections/code-area/terminal/terminal.component';
import { DashboardComponent } from './sections/dashboard/dashboard.component';

const config: SocketIoConfig = { url: environment.socketServer, options: {} };

@NgModule({
	declarations:
		[ AppComponent, CodeDocumentComponent, TerminalComponent, DashboardComponent, LoginComponent, SignUpComponent ],
	imports:
		[
			BrowserModule,
			SocketIoModule.forRoot(config),
			AppRoutingModule,
			CodemirrorModule,
			ReactiveFormsModule,
			NgTerminalModule,
			HttpClientModule
		],
	providers: [],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
